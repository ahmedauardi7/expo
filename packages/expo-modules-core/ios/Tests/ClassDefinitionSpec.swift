import ExpoModulesTestCore

@testable import ExpoModulesCore

class ClassDefinitionSpec: ExpoSpec {
  override class func spec() {
    describe("basic") {
      it("factory returns a definition") {
        let klass = Class("") {}
        expect(klass).to(beAnInstanceOf(ClassDefinition.self))
      }

      it("has a name") {
        let expoClassName = "ExpoClass"
        let klass = Class(expoClassName) {}
        expect(klass.name) == expoClassName
      }

      it("is without native constructor") {
        let klass = Class("") {}
        expect(klass.constructor).to(beNil())
      }

      it("has native constructor") {
        let klass = Class("") { Constructor {} }
        expect(klass.constructor).notTo(beNil())
      }

      it("ignores constructor as function") {
        let klass = Class("") { Constructor {} }
        expect(klass.functions["constructor"]).to(beNil())
      }

      it("builds a class") {
        let appContext = AppContext.create()
        let klass = Class("") {}
        let object = try klass.build(appContext: appContext)

        expect(object.hasProperty("prototype")) == true
        expect(object.getProperty("prototype").kind) == .object
      }
    }

    describe("module") {
      let appContext = AppContext.create()
      let runtime = try! appContext.runtime

      beforeSuite {
        class ClassTestModule: Module {
          func definition() -> ModuleDefinition {
            Name("ClassTest")

            Class("MyClass") {
              Constructor {}

              Function("myFunction") {
                return "foobar"
              }

              Property("foo") {
                return "bar"
              }
            }
          }
        }
        appContext.moduleRegistry.register(moduleType: ClassTestModule.self)
      }

      it("is a function") {
        let klass = try runtime.eval("expo.modules.ClassTest.MyClass")
        expect(klass.isFunction()) == true
      }

      it("has a name") {
        let klass = try runtime.eval("expo.modules.ClassTest.MyClass.name")
        expect(klass.getString()) == "MyClass"
      }

      it("has a prototype") {
        let prototype = try runtime.eval("expo.modules.ClassTest.MyClass.prototype")
        expect(prototype.isObject()) == true
      }

      it("has keys in prototype") {
        let prototypeKeys = try runtime.eval("Object.keys(expo.modules.ClassTest.MyClass.prototype)")
          .getArray()
          .map { $0.getString() }

        expect(prototypeKeys).to(contain("myFunction"))
        expect(prototypeKeys).notTo(contain("__native_constructor__"))
      }

      it("is an instance of") {
        let isInstanceOf = try runtime.eval([
          "myObject = new expo.modules.ClassTest.MyClass()",
          "myObject instanceof expo.modules.ClassTest.MyClass",
        ])

        expect(isInstanceOf.getBool()) == true
      }

      it("defines properties on initialization") {
        // The properties are not specified in the prototype, but defined during initialization.
        let object = try runtime.eval("new expo.modules.ClassTest.MyClass()").asObject()
        expect(object.getPropertyNames()).to(contain("foo"))
        expect(object.getProperty("foo").getString()) == "bar"
      }
    }

    describe("class with associated type") {
      let appContext = AppContext.create()
      let runtime = try! appContext.runtime

      beforeSuite {
        appContext.moduleRegistry.register(moduleType: ModuleWithCounterClass.self)
      }
      it("is defined") {
        let isDefined = try runtime.eval("'Counter' in expo.modules.TestModule")

        expect(isDefined.getBool()) == true
      }
      it("creates shared object") {
        let jsObject = try runtime.eval("new expo.modules.TestModule.Counter(0)").getObject()
        let nativeObject = appContext.sharedObjectRegistry.toNativeObject(jsObject)

        expect(nativeObject).notTo(beNil())
      }
      it("registers shared object") {
        let oldSize = appContext.sharedObjectRegistry.size
        try runtime.eval("object = new expo.modules.TestModule.Counter(0)")

        expect(appContext.sharedObjectRegistry.size) == oldSize + 1
      }
      it("calls function with owner") {
        try runtime.eval([
          "object = new expo.modules.TestModule.Counter(0)",
          "object.increment(1)",
        ])
        // no expectations, just checking if it doesn't fail
      }
      it("creates with initial value") {
        let initialValue = Int.random(in: 1..<100)
        let value = try runtime.eval([
          "object = new expo.modules.TestModule.Counter(\(initialValue))",
          "object.getValue()",
        ])

        expect(value.kind) == .number
        expect(value.getInt()) == initialValue
      }
      it("gets shared object value") {
        let value = try runtime.eval([
          "object = new expo.modules.TestModule.Counter(0)",
          "object.getValue()",
        ])

        expect(value.kind) == .number
        expect(value.isNumber()) == true
      }
      it("changes shared object") {
        try runtime.eval("object = new expo.modules.TestModule.Counter(0)")
        let incrementBy = Int.random(in: 1..<100)
        let value = try runtime.eval("object.getValue()").asInt()
        let newValue = try runtime.eval([
          "object.increment(\(incrementBy))",
          "object.getValue()",
        ])

        expect(newValue.kind) == .number
        expect(newValue.getInt()) == value + incrementBy
      }

      it("gets value from the dynamic property") {
        let initialValue = Int.random(in: 1..<100)
        let value = try runtime.eval([
          "object = new expo.modules.TestModule.Counter(\(initialValue))",
          "object.currentValue"
        ])

        expect(value.kind) == .number
        expect(value.getInt()) == initialValue
      }

      it("initializes the shared object from native") {
        let initialValue = Int.random(in: 1..<100)
        let value = try runtime.eval("expo.modules.TestModule.newCounter(\(initialValue))")

        expect(value.kind) == .object
        expect(value.getObject().getProperty("currentValue").getInt()) == initialValue
      }
    }

    describe("constructor error handling") {
      let appContext = AppContext.create()
      let runtime = try! appContext.runtime

      beforeSuite {
        class ErrorTestModule: Module {
          func definition() -> ModuleDefinition {
            Name("ErrorTest")

            Class("FailingClass") {
              Constructor { (shouldFail: Bool) in
                if shouldFail {
                  throw TestCodedException()
                }
                return Counter(initialValue: 0)
              }

              Function("test") {
                return "success"
              }
            }
          }
        }
        appContext.moduleRegistry.register(moduleType: ErrorTestModule.self)
      }

      it("exceptions are in the correct format") {
        expect {
          try runtime.eval("new expo.modules.ErrorTest.FailingClass(true)")
        }.to(throwError { (error: JavaScriptEvalException) in
          let reason = error.param.userInfo["message"] as? String ?? ""
          expect(reason).to(contain("Calling the 'constructor' function has failed"))
          expect(reason).to(contain("→ Caused by:"))
          expect(reason).to(contain("This is a test Exception with a code"))
        })
      }

      it("check error codes from coded exceptions") {
        let errorCode = try runtime.eval([
          "try { new expo.modules.ErrorTest.FailingClass(true) } catch (error) { error.code }"
        ]).getString()
        expect(errorCode) == "E_TEST_CODE"
      }

      it("succeeds when constructor does not throw") {
        let result = try runtime.eval("new expo.modules.ErrorTest.FailingClass(false)")
        expect(result.kind) == .object
        expect(result.getObject().hasProperty("test")) == true
      }

      it("can call methods on successfully constructed objects") {
        let result = try runtime.eval([
          "obj = new expo.modules.ErrorTest.FailingClass(false)",
          "obj.test()"
        ])
        expect(result.getString()) == "success"
      }
    }
  }
}

/**
 A module that exposes a Counter class with an associated shared object class.
 */
fileprivate final class ModuleWithCounterClass: Module {
  func definition() -> ModuleDefinition {
    Name("TestModule")

    Function("newCounter") { (initialValue: Int) in
      return Counter(initialValue: initialValue)
    }

    Class(Counter.self) {
      Constructor { (initialValue: Int) in
        return Counter(initialValue: initialValue)
      }
      Function("increment") { (counter, value: Int) in
        counter.increment(by: value)
      }
      Function("getValue") { counter in
        return counter.currentValue
      }

      Property("currentValue") { counter in
        return counter.currentValue
      }
    }
  }
}

/**
 A shared object class that stores some native value and can be used as an associated type of the JS class.
 */
fileprivate final class Counter: SharedObject {
  var currentValue = 0

  init(initialValue: Int = 0) {
    self.currentValue = initialValue
  }

  func increment(by value: Int = 1) {
    currentValue += value
  }
}

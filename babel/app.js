class App {
  @log(3)
  add(a, b) {
    return a + b;
  }
}

function log(str) {
  return function(target, name, descriptor) {
    var oldValue = descriptor.value;
    
    descriptor.value = function() {
      console.log(arguments);
      return oldValue.apply(this, arguments);
    };

    return descriptor;
  }
}
const a = new App();
a.add(3,4)
var tape = require("tape"),
    foo = require("../");

tape("foo() returns the answer to the ultimate question of life, the universe, and everything.", function(test) {
  console.info(foo); 
  test.equal(foo.foo(), 42);
  test.end();
});

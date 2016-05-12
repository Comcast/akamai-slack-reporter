module.exports = {
  extend: function(a, b) {
    var key;

    for(key in b) {
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  sortByKey: function(array, key) {
    return array.sort(function(a, b) {
      var x = a[key],
          y = b[key];

      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
};

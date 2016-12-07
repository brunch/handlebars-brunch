module.exports.runtimeTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: true
      }
    }
  }
};

module.exports.runtimeFalse = {
  plugins: {
    handlebars: {
      include: {
        runtime: false
      }
    }
  }
};

module.exports.runtimeFalseOptimizedTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: false
      }
    }
  },
  optimize: true
};

module.exports.runtimeTrueAmdTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: true,
        amd: true
      }
    }
  }
};

module.exports.runtimeTrueOptimizeTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: true
      }
    }
  },
  optimize: true
};

module.exports.runtimeTrueAmdTrueOptimizeTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: true,
        amd: true
      }
    }
  },
  optimize: true
};

module.exports.runtimeTrueAmdTrue = {
  plugins: {
    handlebars: {
      include: {
        runtime: true,
        amd: true
      }
    }
  }
};

module.exports.amdTrue = {
  plugins: {
    handlebars: {
      include: {
        amd: true,
        runtime: false
      }
    }
  }
};

module.exports.amdTrueOptimizeTrue = {
  plugins: {
    handlebars: {
      include: {
        amd: true,
        runtime: false
      }
    }
  },
  optimize: true
};

module.exports.amdFalse = {
  plugins: {
    handlebars: {
      include: {
        amd: false,
        runtime: false
      }
    }
  }
};


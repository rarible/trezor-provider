const exec = require('child_process').exec;
function execute(command) {
    return new Promise((resolve, reject) => {
        exec(command, function(error, stdout) {
            if (error != null) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

function showUi(className) {
    return execute("java -cp " + require.resolve("../ui-0.1.0.jar") + " " + className)
        .then(out => out.trim())
}

module.exports = showUi

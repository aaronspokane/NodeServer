const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
var express = require('express');
var router = express.Router();

router.get('/:sha', function(req, res, next) {
    GetCommits(req.params.sha, res).then(function(result) {
        res.send(result);
    }).catch(function(e){
        res.send(e);
    });    
});

const GetCommits = async (sha, res) => {
    return new Promise(function(resolve, reject) {   
        const val = exec(`git show --pretty="" --name-only ${sha}`, {cwd: 'C:/Dev/Repository/Interfaces'}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }  
            resolve(stdout.trim());
        }); 
    });     
}

module.exports = router;

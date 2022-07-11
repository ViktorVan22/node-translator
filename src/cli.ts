#!/user/bin/env node
import commander from "commander";
import { translate } from './main';

const program = new commander.Command()

program
    .version('0.0.1')
    .name('translator')
    .usage('<English>')  //尖括号表示必填
    .arguments('<English>')
    .action(function (word) {
        translate(word)
    })

program.parse(process.argv)
import fs from 'fs'
import fss from 'fs/promises'

export default function Logger(prefix='', timestamp=true) {
    const infoStream = loadLogStream("logs/info.txt")
    const warnStream = loadLogStream("logs/warn.txt")
    const errorStream = loadLogStream("logs/error.txt")

    async function loadLogStream(path) {
        try {
            await fss.stat(path)
            return fs.createWriteStream(path, {flags: 'a'})
        } catch (error) {
            return fs.createWriteStream(path)
        }
    }

    async function writeToLog(logStream, message) {
        const stream = await logStream
        stream.write(message + "\n")
    }

    function buildPrefix() {
        let combo_prefix = prefix
        if (timestamp) combo_prefix = `${new Date().toISOString()} ${prefix}`
        return combo_prefix
    }

    function log(...args) {
        let message_prefix = buildPrefix()
        let message = message_prefix + args
        console.info(...[message_prefix, ...args])
        writeToLog(infoStream, message)
    }

    async function warn(...args) {
        let message_prefix = buildPrefix()
        let message = message_prefix + args
        console.info(...[message_prefix, ...args])
        writeToLog(warnStream, message)
    }

    async function error(...args) {
        let message_prefix = buildPrefix()
        let message = message_prefix + new Error(args)
        console.error(...[buildPrefix(), new Error(args)])
        writeToLog(errorStream, message)
    }

    return {
        log,
        warn,
        error
    }
}
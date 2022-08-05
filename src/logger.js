import fs from 'fs'
import fss from 'fs/promises'

export default function Logger(
    prefix = '',
    timestamp = true,
    excludeEnvs = ['development', 'staging'],
    noLogToFile = false
) {
    // @ts-ignore
    const env = process.env.NODE_ENV || ''
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
        if (!checkExcludeEnv() && !noLogToFile) {
            const stream = await logStream
            stream.write(message + "\n")
        }
    }

    function checkExcludeEnv() {
        return excludeEnvs.indexOf(env) !== -1
    }

    function buildPrefix(level) {
        let combo_prefix = prefix
        if (timestamp) combo_prefix = `${new Date().toISOString()} ${prefix} ${level}`
        return combo_prefix
    }

    function logOutput(level, msgPrefix, args) {
        if (msgPrefix) {
            console[level](msgPrefix, ...args)
        } else {
            console[level](...args)
        }
    }

    function log(...args) {
        let message_prefix = buildPrefix('INFO: ')
        logOutput('info', message_prefix, args)
        writeToLog(infoStream, message_prefix + args)
    }

    function warn(...args) {
        let message_prefix = buildPrefix('WARN: ')
        logOutput('warn', message_prefix, args)
        writeToLog(warnStream, message_prefix + args)
    }

    function error(...args) {
        let message_prefix = buildPrefix('ERROR: ')
        logOutput('error', message_prefix, args)
        writeToLog(errorStream, message_prefix + args)
    }

    return {
        log,
        warn,
        error
    }
}
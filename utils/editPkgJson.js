import PackageJson from '@npmcli/package-json'
import logInfo from './logInfo.js'
import colors from 'ansi-colors'

/** modifies package.json | adds or modifies package.json properties. */
export default async function editPkgJson(obj, path) {
    return new Promise(async (resolve) => {
        const pkgJson = new PackageJson(path)
        await pkgJson.load()
        pkgJson.update(obj)
        await pkgJson.save()
        await logInfo("package.json has updated successfully.")
        resolve(true)
    })
}
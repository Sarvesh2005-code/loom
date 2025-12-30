import { generateKeyPairSync } from 'crypto';
import { importPKCS8, importSPKI, exportJWK } from 'jose';
import { execSync } from 'child_process';

async function main() {
    try {
        console.log("1. Generating Key Pair...");
        const { privateKey, publicKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        // 2. Format Private Key (Space-delimited, no backslashes)
        const envVarKey = privateKey.replace(/[\r\n]+/g, ' ');
        if (envVarKey.includes('\\')) throw new Error("Backslash detected in private key");

        console.log("   Private Key sanitized.");

        // 3. Generate JWKS
        console.log("2. Generating JWKS...");
        const publicKeyObj = await importSPKI(publicKey, 'RS256');
        const jwk = await exportJWK(publicKeyObj);
        // Convex Auth expects "keys" array, and use should be 'sig' and alg 'RS256'
        jwk.use = 'sig';
        jwk.alg = 'RS256';

        const jwks = { keys: [jwk] };
        const jwksString = JSON.stringify(jwks);
        console.log("   JWKS generated.");

        // 4. Set Environment Variables
        console.log("3. Uploading to Convex...");

        // Pushing Private Key
        console.log("   Setting JWT_PRIVATE_KEY...");
        execSync(`npx convex env set JWT_PRIVATE_KEY="${envVarKey}"`, { stdio: 'inherit' });

        // Pushing JWKS
        console.log("   Setting JWKS...");
        // Handle JSON escaping for CLI
        // Stringifying twice gives us a quoted string with escaped inner quotes: "{\"keys\":...}"
        const escapedJwks = JSON.stringify(jwksString);
        // Remove the surrounding quotes added by stringify to manually control them if needed, 
        // OR just use the output.
        // On Windows cmd, we want: npx convex env set JWKS="{\"keys\":...}"
        // escapedJwks is exactly: "{\"keys\":...}" (including quotes)
        // So we can just append it?
        // Note: execSync might interpret quotes.

        const cmd = `npx convex env set JWKS=${escapedJwks}`;
        execSync(cmd, { stdio: 'inherit' });

        console.log("✅ SUCCESS: Keys and JWKS updated.");

    } catch (err) {
        console.error("❌ FAILED:", err);
        process.exit(1);
    }
}

main();

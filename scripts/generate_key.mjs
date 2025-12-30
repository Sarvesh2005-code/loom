import { generateKeyPairSync } from 'crypto';
import { execSync } from 'child_process';

const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Replace newlines with spaces to avoid shell escaping issues on Windows.
// PEM parsers usually handle spaces fine as delimiters for headers/footers.
const onelineKey = privateKey.replace(/\n/g, ' ');
try {
    execSync(`npx convex env set JWT_PRIVATE_KEY="${onelineKey}"`, { stdio: 'inherit' });
    console.log("Successfully set JWT_PRIVATE_KEY");
} catch (error) {
    console.error("Failed to set env var:", error);
}

import * as alias from 'module-alias';
import { resolve, join } from 'path';

const distDir = resolve('./dist/');
console.log(`>>>> ${__dirname}`);
alias.addAlias('common', join(distDir, 'services/common/ts'));
alias.addAlias('shared', join(distDir, 'shared/src'));
//alias.addPath(projectDir + 'server/src');

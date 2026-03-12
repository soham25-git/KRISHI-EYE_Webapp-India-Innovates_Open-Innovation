const fs = require('fs');
const path = require('path');

const modules = [
    'auth', 'users', 'farms', 'fields', 'tractors', 'jobs',
    'telemetry', 'analytics', 'support', 'admin', 'ai-proxy', 'demo', 'health', 'audit'
];

const srcDir = path.join(__dirname, '../src');

modules.forEach(mod => {
    const modDir = path.join(srcDir, mod);
    if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });

    const capitalize = (s) => s.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    const className = capitalize(mod);

    // Module
    const moduleCode = `import { Module } from '@nestjs/common';
import { ${className}Controller } from './${mod}.controller';
import { ${className}Service } from './${mod}.service';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service],
})
export class ${className}Module {}
`;
    fs.writeFileSync(path.join(modDir, `${mod}.module.ts`), moduleCode);

    // Controller
    const controllerCode = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ${className}Service } from './${mod}.service';

@ApiTags('${mod}')
@Controller({ path: '${mod}', version: '1' })
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  // Scaffolded methods depending on module
}
`;
    fs.writeFileSync(path.join(modDir, `${mod}.controller.ts`), controllerCode);

    // Service
    const serviceCode = `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
  // Service stub
}
`;
    fs.writeFileSync(path.join(modDir, `${mod}.service.ts`), serviceCode);
});
console.log('Modules scaffolded.');

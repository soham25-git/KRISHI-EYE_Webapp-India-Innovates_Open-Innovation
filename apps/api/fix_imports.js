const fs = require('fs');
const files = [
    'src/tractors/tractors.service.ts',
    'src/telemetry/telemetry.service.ts',
    'src/support/support.service.ts',
    'src/jobs/jobs.service.ts',
    'src/fields/fields.service.ts',
    'src/farms/farms.service.ts',
    'src/demo/demo.service.ts',
    'src/common/services/ownership.service.ts',
    'src/analytics/analytics.service.ts',
    'src/ai-proxy/ai-proxy.service.ts',
    'src/auth/auth.service.ts',
    'src/app.module.ts'
];
files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/\.\.\/prisma\/prisma\.service/g, '../database/prisma.service')
            .replace(/\.\.\/\.\.\/prisma\/prisma\.service/g, '../../database/prisma.service')
            .replace(/'\.\/prisma\/prisma\.module'/g, "'./database/database.module'")
            .replace(/PrismaModule/g, 'DatabaseModule');
        fs.writeFileSync(f, content);
        console.log('Updated ' + f);
    } catch (e) {
        console.error('Error with ' + f, e.message);
    }
});

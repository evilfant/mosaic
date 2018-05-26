import { NgModule } from '@angular/core';

import { McCommonModule } from '@ptsecurity/mosaic/core';

import { McIcon } from './icon.component';


@NgModule({
    imports: [
        McCommonModule
    ],
    exports: [
        McIcon,
        McCommonModule
    ],
    declarations: [
        McIcon
    ]
})
export class McIconModule {}

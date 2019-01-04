import { NgModule } from '@angular/core';

import { AddStructureComponent } from "./add-structure/add-structure";

import { IonicModule } from 'ionic-angular';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
	declarations: [
		AddStructureComponent
	],
	imports: [
		IonicModule,
		PipesModule,
	],
	exports: [
		AddStructureComponent
	]
})
export class GlobalComponentsModule {}
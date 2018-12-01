import { NgModule } from '@angular/core';
import { RentalResumeComponent } from './rental-resume/rental-resume';
import { RentalLastLogComponent } from "./rental-last-log/rental-last-log";
import { RentalMenuComponent } from "./rental-menu/rental-menu";
import { RentalAddFormComponent } from "./rental-add-form/rental-add-form";
import { IonicModule } from 'ionic-angular';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
	declarations: [
		RentalResumeComponent,
		RentalLastLogComponent,
		RentalMenuComponent,
		RentalAddFormComponent
	],
	imports: [
		IonicModule,
		PipesModule,
	],
	exports: [
		RentalResumeComponent,
		RentalLastLogComponent,
		RentalMenuComponent,
		RentalAddFormComponent
	]
})
export class RentalComponentsModule {}

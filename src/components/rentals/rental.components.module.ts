import { NgModule } from '@angular/core';
import { RentalResumeComponent } from "./rental-resume/rental-resume";
import { RentalLastLogComponent } from "./rental-last-log/rental-last-log";
import { RentalMenuComponent } from "./rental-menu/rental-menu";
import { RentalAddFormComponent } from "./rental-add-form/rental-add-form";
import { RentalConfigComponent } from "./rental-config/rental-config";
import { RentalQuotationVerboseComponent } from "./rental-quotation-verbose/rental-quotation-verbose";
import { IonicModule } from 'ionic-angular';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
	declarations: [
		RentalResumeComponent,
		RentalLastLogComponent,
		RentalMenuComponent,
		RentalAddFormComponent,
		RentalConfigComponent,
		RentalQuotationVerboseComponent
	],
	imports: [
		IonicModule,
		PipesModule,
	],
	exports: [
		RentalResumeComponent,
		RentalLastLogComponent,
		RentalMenuComponent,
		RentalAddFormComponent,
		RentalConfigComponent,
		RentalQuotationVerboseComponent
	]
})
export class RentalComponentsModule {}

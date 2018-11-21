import { NgModule } from '@angular/core';
import { RoundPercentPipe } from './number/round';
import { TrimTextPipe } from "./text/trim";
@NgModule({
	declarations: [
		RoundPercentPipe,
		TrimTextPipe
	],
	imports: [],
	exports: [
		RoundPercentPipe,
		TrimTextPipe
	]
})
export class PipesModule {}

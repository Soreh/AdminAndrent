import { Quotationverbose } from "./quotation-verbose-interface";
import { STATUSCODE } from "../global/status.interface";
import { RentalConfig } from "./rentals-config.interface";
import { QuotationOption } from "./quotation-option.interface";
import { splitClasses } from "@angular/compiler";

/**
 * Class that deals with the Quotation
 * This file also exports a few intefaces
 */

export class Quotation {
    statusCode  : number;
    total       : Total;
    discount    : any;
    details     ?: QuotationDetails[];
    verbose     ?: Quotationverbose;

    constructor(private rentalId = null, private args:QuotationArgs = null){
        this.statusCode = STATUSCODE.toBeSend;
        this.discount = 0;
        this.total = {
            amount : 0,
            cost : 0,
        };
        this.verbose = {
            amount : 0,
            discount : 0,
            categories : [ 
                {
                    id: 'none',
                    label: 'Options',
                    lines: []
                }
            ]
        };
        this.details = [];

        //Sets the RentalID (don't know if it's compulsory)
        if (rentalId) {
            this.rentalId = rentalId;
        }

        if( args ) {
            this.statusCode = args.statusCode;
            //this.rentalId = args.rentalId;
            this.total.amount = args.total.amount,
            this.total.cost = args.total.cost;
            this.discount = args.discount;
            if (args.verbose ) {
                this.verbose = args.verbose;
            } else {
                for (let index = 0; index < this.verbose.categories.length; index++) {
                    this.verbose.categories[index].lines = args.verbose.categories[index].lines;
                }
            }
            this.details = args.details;
        }
    }

    /**
     * @returns the values of the Quotation, in a simple object to store in DB
     */
    getQuotationArgs() : QuotationArgs {
        let data: QuotationArgs = {
            statusCode  : this.statusCode,
            total       : this.total,
            discount    : this.discount,
        }

        if ( this.details ) {
            data.details = this.details;
        }

        if ( this.verbose ) {
            data.verbose = this.verbose;
        }

        return data;
    }

    getSortedOptions( config: RentalConfig ) : any {
        let sortedOptions = [];
        config.categories.forEach(cat => {
          var category = {
            name : cat.label,
            isPost : cat.isPostQuotation,
            options : [],
          };
          if(this.details){
            this.details.forEach(option=> {
              var optionToLoad : QuotationOption;
              if(option.optionID != 0){
                optionToLoad = config.options.filter(quotationOption => quotationOption.id === option.optionID)[0];
              } else {
                optionToLoad = {
                  id : option.optionID,
                  amount : option.variousAmount,
                  label : option.variousLabel,
                  cost : option.variousCost,
                  catId : option.variousCatID,
                  chargeTypeId : option.variousChargeTypeId,
                  chargeId : option.variousChargeId,
                };
              }
              if(optionToLoad.catId === cat.id) {
                optionToLoad.unit = option.units;
                category.options.push(optionToLoad);
              }
            });
          }
          sortedOptions.push(category);
        });
        return sortedOptions;
    };

    removeSortedOption( option : QuotationOption ) {
        let optionToDeleteIndex;
        if (option.id != 0 ){
            // Si l'id n'est pas zéro (et donc c'est une option préenregistrée), je récupère la QuotationDetails d'id correspondante
            optionToDeleteIndex = this.details.findIndex(detail => detail.optionID === option.id);
        } else {
            // Si l'id vaut zéro, je dois récupérer la QuotationDetails en me basant sur une équivalence entre tous les paramètre various
            optionToDeleteIndex = this.details.findIndex(detail => 
                detail.variousAmount === option.amount
                && detail.variousCost === option.cost
                && detail.variousLabel === option.label);
        }
        if( optionToDeleteIndex != -1 ){
            this.details.splice(optionToDeleteIndex, 1);
        } else {
            console.log("No index found in removeSortedOption");
        }
    }

    hasOption(optionId : any, id: number = -1): boolean {
        if ( this.details ) {
            id = this.details.findIndex(detail => detail.optionID === optionId && detail.optionID != 0);
        }
        return id >= 0;
    }
}


/**
 * Interfaces
 */

export interface Total {
    amount : number;
    cost : number;
}

export interface CategorizedQuotationDetails {
    catID : any;
    options : QuotationDetails[];
}

export interface QuotationDetails {
    units : number;
    optionID : any;
    variousLabel ?: string;
    variousAmount ?: number;
    variousCost ?: number;
    variousCatID ?: any;
    variousChargeTypeId ?: any;
    variousChargeId ?: any;
}

export interface QuotationArgs {
    //rentalId    : any;
    statusCode  : number;
    total       : Total;
    discount    : any;
    details     ?: QuotationDetails[];
    verbose     ?: Quotationverbose;
}
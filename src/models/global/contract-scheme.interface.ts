export interface ContractScheme {
    article?: ContractArticle[];
}

export interface ContractArticle extends AbstractArticle {
    title: string;
    conditionID?: any;
}

export interface ContractParagraph extends AbstractArticle {
    text: string;
    condition: boolean;
    listAuto?: any;
    listModel?: string;
    type?: any;
    conditionID?: any;
    replacementText?: string;
    list?: string[];
}

export interface AbstractArticle {
    paragraphs?: ContractParagraph[];
}
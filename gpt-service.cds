namespace gpt;

entity dummy {
    key id   : UUID;
        text : String;
}

annotate dummy with @(
    odata.draft.enabled,
    Capabilities: {
        Insertable: true,
        Updatable : true,
        Deletable : true
    }
);

annotate dummy with @UI: {
    Identification : [{
        $Type : 'UI.DataFieldForAction',
        Action: 'gpt.ChatGptService.call',
        Label : '{i18n>callgpt}'
    }],
    SelectionFields: [],
    LineItem       : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'gpt.ChatGptService.call',
            Label : '{i18n>callgpt}'
        },
        {Value: id},
        {Value: text}
    ],
    HeaderInfo     : {
        Title         : {Value: id},
        Description   : {Value: text},
        TypeName      : '{i18n>typeName}',
        TypeNamePlural: '{i18n>typeNamePlural}',
    },
};

@path: '/gpt-odata'
service ChatGptService {

    action call() returns String;

    entity dummy as projection on gpt.dummy actions {
        @cds.odata.bindingparameter.name: '_it'
        @Common                         : {
            IsActionCritical: true,
            SideEffects     : {TargetProperties: ['_it/text']}
        }
        action call() returns String;
    }

}

/**
 * Created by mike.mayori on 4/28/16.
 */
app.factory("Patient",function(CoreModel, envService) {
    var coreServicesUrl = envService.read('coreServicesUrl');
    return CoreModel.instance({
        $type : "Patient", //Define the Object type
        $pkField : "id", //Define the Object primary key

        $settings : {
            urls : {
                base : coreServicesUrl+ "thing",
                get : coreServicesUrl+ "thing/:id"
            },
            dataField : {
                many : "results"
            }
        }

    });
});

app.factory("Patients",function(CoreModel,envService, Patient) {
    var coreServicesUrl = envService.read('coreServicesUrl');
    return CoreModel.instance({
        $type : "Patients", //Define the Object type
        $pkField : "_id", //Define the Object primary key
        $mapping : {
            id : null,
            Patient : Patient
        },
        $settings : {
            urls : {
                base : coreServicesUrl+ "things/?treeView=false",
                get : coreServicesUrl+ "things/?treeView=false"
            },
            dataField : {
                many : "results"
            }
        },
        $hasOne : {
            Patient : {
                id : "_id"
            }
        }

    });
});


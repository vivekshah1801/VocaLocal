let currentCamera = -1;
let cameraList = null;
let scanner = null;

$(document).ready(function(){
    scanner = new ZXing.BrowserBarcodeReader();
    console.log("VocaLocal: Scanner Loaded");

    scanner.getVideoInputDevices()
    .then(inputDevices =>{
        cameraList = inputDevices;

        if(inputDevices.length <= 0 )
        {
            console.log("VocaLocal: No proper video input device found");
            Swal.fire({
                icon: 'error',
                title: 'Ohh Oh! :(',
                text: 'Video Camera Not Detected1',
                footer: 'Allow the website to access video.'
            })
        }
        else
        {
            currentCamera = 0;
            if(cameraList.length > 1)
            {
                $("#cameraSwitcher").removeClass('text-muted');
                $("#cameraSwitcher").click(function(){
                    currentCamera = (currentCamera + 1)%(cameraList.length);
                    console.info("VocaLocal: Camera Switched");
                })
            }
        }
        
        decodeOnce();
    })
    .catch(e =>{
        console.error(e)
        Swal.fire({
            icon: 'error',
            title: 'Ohh Oh! :(',
            text: 'Something Went Wrong.',
            footer: 'Please report this via feedback page.  '
        })
    })
})


async function decoding(scanner,currentCamera){
    if (currentCamera < 0)
    {
        return null;
    }

    try{
        const result = await scanner.decodeOnceFromVideoDevice(cameraList[currentCamera].deviceId, 'videoDisplay');
        console.log("VocaLocal: Barcode Decoded: " + result);
        return result;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function decodeOnce()
{
    let decoded = await decoding(scanner,currentCamera);
    if (decoded == null)
    {
        console.error("VocaLocal: Nothing Detected");
        Swal.fire({
            icon: 'error',
            title: 'Ohh Oh! :(',
            text: 'Couldn\'t Detect Anything.',
            footer: 'Video should be bright and visible.'
        })
    }
    else{
        let details = getSweetAlertObject(decoded);

        Swal.fire(details)
        .then(result =>{
            if (result.dismiss == 'close')
            {
                console.log("Stopping Scans");
            }
            else{
                decodeOnce();
            }
        });
    }
}


function getSweetAlertObject(decoded)
{

    if ( !decoded || isNaN(decoded) || decoded.length <= 3)
        return {title: 'Done No', showCloseButton : true, confirmButtonText: 'Scan Again'}

    let { country, icon } = getCountry(decoded.toString().substr(0,3))

    return {icon:icon, title: country, showCloseButton : true, confirmButtonText: 'Scan Again'}
}

function getCountry(code)
{
    country = "Not in the list"
    if ('001' <= code && '019' >=code)
        country = 'USA';
    if ('030' <= code && '039' >=code)
        country = 'USA';
    if ('060' <= code && '139' >=code)
        country = 'USA';
    if ('300' <= code && '379' >=code)
        country = 'France';
    if ('400' <= code && '440' >=code)
        country = 'Germany';
    if ('450' <= code && '459' >=code)
        country = 'Japan';
    if ('490' <= code && '499' >=code)
        country = 'Japan';
    if ('460' <= code && '469' >=code)
        country = 'UK';
    if ('540' <= code && '549' >=code)
        country = 'Belgium & Luxembourg';
    if ('570' <= code && '579' >=code)
        country = 'Denmark';
    if ('600' <= code && '601' >=code)
        country = 'South Africa';
    if ('640' <= code && '649' >=code)
        country = 'Finland';
    if ('690' <= code && '695' >=code)
        country = 'China';
    if ('700' <= code && '709' >=code)
        country = 'Norway';
    if ('730' <= code && '739' >=code)
        country = 'Sweden';
    if ('754' <= code && '755' >=code)
        country = 'Canada';
    if ('760' <= code && '769' >=code)
        country = 'Switzerland';
    if ('789' <= code && '790' >=code)
        country = 'Brazil';
    if ('800' <= code && '839' >=code)
        country = 'Italy';
    if ('840' <= code && '848' >=code)
        country = 'Spain';
    if ('868' <= code && '869' >=code)
        country = 'Turkey';
    if ('870' <= code && '879' >=code)
        country = 'Netherlands';
    if ('900' <= code && '919' >=code)
        country = 'Austria';
    if ('930' <= code && '939' >=code)
        country = 'Australia';
    if ('940' <= code && '949' >=code)
        country = 'New Zealand';

    dangerList = ["China"]

    flag = 'success'
    if (dangerList.includes(country))
        flag = 'error'

    let obj  = {'country':country, 'icon': flag}

    return obj
}
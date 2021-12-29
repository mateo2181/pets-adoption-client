export function getNewUrlWithParams(location: Location, params: any[]) {
    let searchParams = new URLSearchParams();
    console.log(params);
    params.forEach(param => {
        if(param.length === 2) {
            if(param[1]) {
                searchParams.set(param[0], param[1]);
            }
        }
    });
    let newurl = `${location.protocol}//${location.host}${location.pathname}?${searchParams.toString()}`;
    return newurl;
}
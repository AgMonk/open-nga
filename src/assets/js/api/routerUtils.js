export  const  getRoute = (array)=>{
    return "/"+array.join("/")
}

// noinspection SpellCheckingInspection
export const getRouteParam = (route,key) =>{
    let value = route.params[key]
    if (!value || value === 0 || value === "0") {
        return undefined
    }
    return value;
}
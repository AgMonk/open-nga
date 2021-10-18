export  const  getCookieMap = ()=>{
  let cookieString = document.cookie;
  let map = {};
  cookieString.split("; ").forEach(line=>{
    let s = line.split("=");
    map[s[0]] = s[1];
  })
  return map;
}

export const setCookie = (key,value,expires)=>{
  let e = "";
  if (expires) {
    let day = 24 * 60 * 60 * 1000;
    let date = new Date();
    date.setTime(date.getTime()+expires*day);
    e = "expires="+date.toUTCString();
    console.log(e)
  }
  document.cookie = key +'='+value+";path=/"+"; "+e;
}

export const getCookie = (key)=>{
  return getCookieMap()[key];
}

export const setCookies = (cookieString,expires)=>{
  let cookies = cookieString.split("; ");
  cookies.forEach(cookie =>{
    let s = cookie.split("=");
    setCookie(s[0],s[1],expires)
  })
}

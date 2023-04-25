export const getFromCookie = ( cookieName ) => {
  const cookieValue = document.cookie.replace(
    new RegExp(
      "(?:(?:^|.*;)\\s*" +
        cookieName.replace(/[\-\.\+\*]/g, "\\$&") +
        "\\s*\\=\\s*([^;]*).*$)|^.*$"
    ),
    "$1"
  );

  if ( cookieValue ){
    return JSON.parse(decodeURIComponent(cookieValue))
  } else {
    document.cookie = `${cookieName}=${ JSON.stringify([] )}`;
    return []
  }
};

export const updateCookie = ( cookieName, updatedVal ) => {
  document.cookie = `${ cookieName }=${ JSON.stringify( updatedVal )}`;
}

export const deleteCookie = cookieName => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
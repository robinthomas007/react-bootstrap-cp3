
export function cp3Urls(env: string) {
  const cp3_app_urls = {
    url: "https://api.dev.cp3.umgapps.com/api/",
    widgetUrl: "https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search",
    apiUrl: "https://party-qa.gr4o-nonprod.umusic.net/party-api"
  }
  // eslint-disable-next-line default-case
  switch (env) {
    case "dev":
      cp3_app_urls.url = "https://api.dev.cp3.umgapps.com/api/"
      cp3_app_urls.widgetUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search"
      cp3_app_urls.apiUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-api"
      return cp3_app_urls
    case "qa":
      cp3_app_urls.url = "https://api.qa.cp3.umgapps.com/api/";
      cp3_app_urls.widgetUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search"
      cp3_app_urls.apiUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-api"
      return cp3_app_urls
    case "uat":
      cp3_app_urls.url = "https://api.uat.cp3.umgapps.com/api/";
      cp3_app_urls.widgetUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search";
      cp3_app_urls.apiUrl = "https://party-qa.gr4o-nonprod.umusic.net/party-api"
      return cp3_app_urls
    case "prod":
      cp3_app_urls.url = "https://api.cp3.umgapps.com/api/";
      cp3_app_urls.widgetUrl = "https://party-prod.gr4o.umusic.net/party-workspace/search";
      cp3_app_urls.apiUrl = "https://party-prod.gr4o.umusic.net/party-api"
      return cp3_app_urls
  }
}
const Handlebars = require("handlebars")

const parseTemplate = function(template, variables) {
  Handlebars.registerHelper('capitalize', function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })
  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context)
  })
  const compile = Handlebars.compile(template)
  return compile(variables)
}

const generateTemplate = async function (strapi, template) {
  // const configPath = __dirname + "/assets"
  // const globalMailHeader = fs.readFileSync(configPath + "/header.html", "utf-8");
  // if (!globalMailHeader) {
  //   errorLog("fixedMailHeader is empty")
  //   return
  // }
  // const globalMailFooter = fs.readFileSync(configPath + "/footer.html", "utf-8");
  // if (!globalMailFooter) {
  //   errorLog("fixedMailFooter is empty")
  //   return
  // }
  // if (!site.mail_header) {
  //   site.mail_header =
  //     "<div class=\"header\">\n" +
  //     "<h1>{{ site.title }}</h1>\n" +
  //     "</div>\n"
  // }
  // if (!site.mail_footer) {
  //   site.mail_footer =
  //     "<div class=\"footer\">\n" +
  //     "<a href=\"{{ websiteUrl }}\">{{ websiteUrl }}</a>\n" +
  //     "</div>\n"
  // }

  const completeTemplate =
    /** =+=+=+= HEADER =+=+=+= **/
    // globalMailHeader + site.mail_header +
    /** =+=+=+= CONTENT =+=+=+= **/
    "<div class=\"content\">" + template.html + "</div>"
    /** =+=+=+= FOOTER =+=+=+= **/
    // site.mail_footer + globalMailFooter

  return completeTemplate
}

module.exports = {
  parseTemplate
}

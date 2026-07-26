const { getGlobal } = require('../functions/getGlobal')
const { getSubmission } = require('../functions/getSubmission')
const {convert} = require("html-to-text")
const inlineCss = require("inline-css")
const { parseTemplate } = require("./template");

// TODO: https://docs.strapi.io/dev-docs/backend-customization/services
//   ==> Example of a custom email service (using Nodemailer)

/**
 * Persist the outcome of the mail send attempt on the submission itself,
 * so it's visible in the Strapi admin without needing server log access.
 */
const updateMailStatus = async ({ documentId, status, error }) => {
  if (!documentId) return
  try {
    await strapi.documents("api::submission.submission").update({
      documentId,
      data: {
        mailStatus: status,
        mailError: error ? String(error).slice(0, 1000) : null,
        mailSentAt: status === "sent" ? new Date() : null,
      },
    })
  } catch (updateError) {
    console.error("Failed to update submission mailStatus:", updateError)
  }
}

module.exports = async (event) => {
  const documentId = event.result?.documentId

  /**
   * Check if the environment is production
   * @type {boolean}
   */
  const isProduction = process.env.NODE_ENV === 'production'
  if (!isProduction) {
    console.log("Not in production environment, returning event...")
    console.log("event >>>>", event)
    return
  }

  /**
   * Check if the email from is set
   * @type {string}
   */
  const emailFrom = process.env.MAIL_DEFAULT_FROM
  if (!emailFrom) {
    console.error("MAIL_DEFAULT_FROM is not set")
    await updateMailStatus({ documentId, status: "failed", error: "MAIL_DEFAULT_FROM is not set" })
    return
  }

  /**
   * Try to email the user
   */
  try {
    const submission = await getSubmission({ strapi, event })
    const { email, name, mailTemplate } = submission
    if (!email) {
      console.error("Email is not set")
      await updateMailStatus({ documentId, status: "failed", error: "Email is not set on submission" })
      return
    } else if (!mailTemplate) {
      console.error("Mail template is not set")
      await updateMailStatus({ documentId, status: "failed", error: "Mail template is not set on submission" })
      return
    }

    const { subject, html } = mailTemplate
    const url = process.env.HOST_NAME
    const variables = {
      event: event,
      result: event.result,
      submission: submission,
      global: await getGlobal({ strapi, event }),
      name: name,
      email: email,
      // TODO
    }

    const template = parseTemplate(html, variables)

    // email the user
    const result = await strapi.plugins.email.services.email.send({
      to: mailTemplate.customEmailFrom,
      //to: name ? name + " <" + email + ">" : email,
      from: emailFrom,
      subject: subject,
      html: await inlineCss(template, { url }),
    })
    console.log("result >>>>", result)

    await updateMailStatus({ documentId, status: "sent" })

    // email the admin
    // const resultAdmin = await strapi.plugins.email.services.email.send({
//      to: emailFrom,
//      from: emailFrom,
//      subject: "Nieuwe inzending",
//      html: await inlineCss(
//        "<h1>Bekijk hier de verstuurde mail met de nieuwe inzending</h1>" + template,
//        { url }
//      ),
//    })

//    console.log("resultAdmin >>>>", resultAdmin)
  } catch (error) {
    console.error(error)
    await updateMailStatus({ documentId, status: "failed", error: error?.message || String(error) })
  }
}

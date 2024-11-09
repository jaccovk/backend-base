const getGlobal = require('../functions/getGlobal')

module.exports = async (event) => {
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
    return
  }

  /**
   * Try to email the user
   */
  try {
    const {email, name} = event.result
    if (!email) {
      console.error("Email is not set")
      return
    }

    const result = await strapi.plugins.email.services.email.send({
      to: name ? name + " <" + email + ">" : email,
      from: emailFrom,
      subject: 'The Strapi Email plugin worked successfully!',
      html: 'Hello world!',
    })

    console.log("result >>>>", result)
  } catch (error) {
    console.error(error)
  }
}

const getSubmission = async ({ strapi, event }) => {
  return strapi.service("api::lead-form-submission.lead-form-submission").findOne(
    event.result.id, {
      populate: ["uploaded"],
    }
  )
}

module.exports = {
  getSubmission
}

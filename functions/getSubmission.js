const getSubmission = async ({ strapi, event }) => {
  return strapi.service("api::submission.submission").findOne(
    event.result.documentId, {
      populate: "*",
    }
  )
}

module.exports = {
  getSubmission
}

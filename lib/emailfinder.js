import verify from "bulk-email-verifier";

export const generateEmails = (firstName, lastName, domain) => {
  const separators = [".", "_", "-", ""];
  const patterns = [
    `${firstName}`,
    `${lastName}`,
    `${firstName}<separator>${lastName}`,
    `${firstName[0]}<separator>${lastName}`,
    `${firstName}<separator>${lastName[0]}`,
    `${firstName[0]}<separator>${lastName[0]}`,
    `${lastName}<separator>${firstName}`,
    `${lastName[0]}<separator>${firstName}`,
    `${lastName}<separator>${firstName[0]}`,
    `${lastName[0]}<separator>${firstName[0]}`,
  ];
  let emails = [];
  separators.map(
    (separator) =>
      (emails = [
        ...emails,
        ...patterns.map(
          (p) => `${p.replace("<separator>", separator)}@${domain}`
        ),
      ])
  );
  emails = Array.from(new Set(emails));
  return emails.join(",");
};

export function bulkverification(emails, domain) {
  return new Promise((res, rej) => {
    verify.verifyEmails(domain, emails, {}, function (err, data) {
      if (err) return rej("server error, double check all input and try again"+JSON.stringify(err));
      res(data.verified);
    });
  });
}

// run in command line env
if (process.argv && process.argv.length === 5) {
  const [firstName, lastName, domain] = process.argv.slice(2);
  let emails = generateEmails(firstName, lastName, domain).split(",");
  console.log(emails);
  bulkverification(emails, domain)
    .then((res) => console.log("verified list:", res))
    .catch(console.log);
}

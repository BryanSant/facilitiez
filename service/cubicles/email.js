const chgEmailDomain = 'chghealthcare.com';

/**
 * @return {string}
 */
function GetEmailToForPerson(name) {
    let email = getEmailForPerson(name);
    return `mailto:${email}`;
}

/**
 * @return {string}
 */
function getEmailForPerson(name) {
    let nameFields = name.toLowerCase().split(' ');
    let firstName = nameFields[0];
    let lastName = nameFields[1];

    return `${firstName}.${lastName}@${chgEmailDomain}`;
}

module.exports = {
    GetEmailToForPerson
};

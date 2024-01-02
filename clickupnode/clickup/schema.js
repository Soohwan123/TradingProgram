const schema = ` 
type Query {
    users: [User],
    discussions: [Discussion],
    snps: SnpData,
    deleteuser(email: String): User,
    deletefollowing(email: String, account: String): String,
    deletediscussion(opinion: String): Discussion,
},
type User {
    email: String
    password: String
    following: [Following]
},
type Following {
    account: String
}
input FollowingInput {
    account: String
}
type Discussion {
    opinion: String
    date: String
    author: String
},

type SnpData {
    timestamp: [Float]
    indicators: [Float]
},

type Mutation {
    adduser(email: String, password: String, following: [FollowingInput]): User
    addfollowing(email: String, account: String): String
    adddiscussion(opinion: String, date: String, author: String): Discussion
    updateuser(originalEmail: String, email: String, password: String): User
    updatefollowing(email: String, following: FollowingInput, index: String): String
    updatediscussion(originalOpinion: String, opinion: String, date: String, author: String): Discussion
 },
   
`;
export { schema };

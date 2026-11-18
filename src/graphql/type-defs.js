export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    applications: [Application!]!
    bookmarks: [Bookmark!]!
    created_at: String
    updated_at: String
  }

  type Company {
    id: ID!
    name: String!
    location: String
    description: String
    jobs: [Job!]!
    created_at: String
    updated_at: String
  }

  type Category {
    id: ID!
    name: String!
    jobs: [Job!]!
    created_at: String
    updated_at: String
  }

  type Job {
    id: ID!
    title: String!
    description: String
    job_type: String
    experience_level: String
    location_type: String
    location_city: String
    salary_min: Float
    salary_max: Float
    is_salary_visible: Boolean!
    status: String
    company: Company
    category: Category
    applications: [Application!]!
    created_at: String
    updated_at: String
  }

  type Application {
    id: ID!
    user_id: ID!
    job_id: ID!
    status: String!
    job: Job
    user: User
    created_at: String
    updated_at: String
  }

  type Bookmark {
    id: ID!
    user_id: ID!
    job_id: ID!
    job: Job
    created_at: String
  }

  type Query {
    jobs(title: String, companyName: String): [Job!]!
    job(id: ID!): Job
    companies: [Company!]!
    company(id: ID!): Company
    categories: [Category!]!
    category(id: ID!): Category

    myProfile: User
    applications: [Application!]!
  }

  type Mutation {
    applyJob(job_id: ID!): Application!
    updateApplicationStatus(id: ID!, status: String!): Application
    addBookmark(job_id: ID!): Bookmark!
    removeBookmark(job_id: ID!): ID
  }
`;

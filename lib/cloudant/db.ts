import { getCloudantClient } from "./client";

const DB_NAMES = ["users", "assessments", "journals", "community_posts"];

export async function initializeDatabases() {
  const cloudant = getCloudantClient();
  if (!cloudant) return false;

  try {
    for (const dbName of DB_NAMES) {
      try {
        await cloudant.putDatabase({ db: dbName });
        console.log(`Database '${dbName}' created.`);
      } catch (error: any) {
        if (error.status !== 412) { // 412 means database already exists
          console.error(`Error creating database ${dbName}:`, error);
        }
      }
    }
    return true;
  } catch (error) {
    console.error("Failed to initialize Cloudant databases:", error);
    return false;
  }
}

// User CRUD
export async function saveUser(userId: string, data: any) {
  const cloudant = getCloudantClient();
  try {
    let rev;
    try {
      const existing = await cloudant.getDocument({ db: "users", docId: userId });
      rev = existing.result._rev;
    } catch (e) {}

    await cloudant.putDocument({
      db: "users",
      docId: userId,
      document: { ...data, _rev: rev, updatedAt: new Date().toISOString() }
    });
    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    return false;
  }
}

export async function getUser(userId: string) {
  const cloudant = getCloudantClient();
  try {
    const res = await cloudant.getDocument({ db: "users", docId: userId });
    return res.result;
  } catch (error) {
    return null;
  }
}

// Assessment CRUD
export async function saveAssessment(userId: string, assessmentData: any) {
  const cloudant = getCloudantClient();
  try {
    await cloudant.postDocument({
      db: "assessments",
      document: { userId, ...assessmentData, createdAt: new Date().toISOString() }
    });
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    return false;
  }
}

export async function getLatestAssessment(userId: string) {
  const cloudant = getCloudantClient();
  try {
    const res = await cloudant.postFind({
      db: "assessments",
      selector: { userId: { "$eq": userId } },
      sort: [{ "createdAt": "desc" }],
      limit: 1
    });
    return res.result.docs[0] || null;
  } catch (error) {
    // Requires an index on createdAt, if it fails, fallback to simple fetch
    try {
      const res = await cloudant.postAllDocs({ db: "assessments", includeDocs: true });
      const userDocs = res.result.rows.filter(r => r.doc?.userId === userId).map(r => r.doc);
      return userDocs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    } catch (fallbackError) {
      return null;
    }
  }
}

// Journal CRUD
export async function saveJournalEntry(userId: string, entry: string, mood: number, aiReflection: string) {
  const cloudant = getCloudantClient();
  try {
    await cloudant.postDocument({
      db: "journals",
      document: { userId, entry, mood, aiReflection, createdAt: new Date().toISOString() }
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getJournals(userId: string) {
  const cloudant = getCloudantClient();
  try {
    const res = await cloudant.postAllDocs({ db: "journals", includeDocs: true });
    return res.result.rows
      .map(r => r.doc)
      .filter((doc: any) => doc.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    return [];
  }
}

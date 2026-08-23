// ------------------------------------------------------------------
// All the Firestore read/write logic for projects lives here, so the
// page components can just call these functions instead of dealing
// with Firestore directly.
// ------------------------------------------------------------------
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Project, ProjectFormData } from '../types'

const projectsRef = collection(db, 'projects')

export async function getAllProjects(): Promise<Project[]> {
  const q = query(projectsRef, orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }))
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Project, 'id'>) }
}

export async function createProject(data: ProjectFormData): Promise<string> {
  const docRef = await addDoc(projectsRef, {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    serverCreatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), {
    ...data,
    updatedAt: Date.now(),
  })
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id))
}

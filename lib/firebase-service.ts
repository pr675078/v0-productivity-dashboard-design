import { db, isDemo } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
} from "firebase/firestore"

// Demo data storage
const demoData: any = {
  users: {},
  focusSessions: [],
  dailyStats: {},
  todos: [],
  timeline: [],
}

export interface UserProfile {
  id: string
  name: string
  email: string
  maxWorkHours: number
  preparingFor: string
  reminders: Reminder[]
  createdAt: any
  updatedAt: any
}

export interface Reminder {
  id: string
  date: string
  title: string
  description: string
  isActive: boolean
}

export interface FocusSession {
  id: string
  userId: string
  duration: number
  startTime: any
  endTime: any
  date: string
  musicType?: string
}

export interface TodoItem {
  id: string
  userId: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  category: "daily" | "weekly" | "monthly"
  createdAt: any
}

export interface TimelineEntry {
  id: string
  userId: string
  title: string
  startTime: string
  endTime: string
  duration: string
  date: string
  tag: string
  category: string
  productivity: number
  createdAt: any
}

// Demo mode functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// User Profile Functions
export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  if (isDemo) {
    demoData.users[userId] = {
      ...profileData,
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return
  }

  try {
    await setDoc(doc(db, "users", userId), {
      ...profileData,
      id: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (isDemo) {
    return demoData.users[userId] || null
  }

  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  if (isDemo) {
    if (demoData.users[userId]) {
      demoData.users[userId] = {
        ...demoData.users[userId],
        ...updates,
        updatedAt: new Date(),
      }
    }
    return
  }

  try {
    await updateDoc(doc(db, "users", userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Focus Session Functions
export const createFocusSession = async (sessionData: Omit<FocusSession, "id">) => {
  const id = generateId()

  if (isDemo) {
    demoData.focusSessions.push({
      ...sessionData,
      id,
      startTime: new Date(),
      endTime: new Date(),
      date: new Date().toISOString().split("T")[0],
    })
    return id
  }

  try {
    const docRef = await addDoc(collection(db, "focusSessions"), {
      ...sessionData,
      startTime: serverTimestamp(),
      endTime: serverTimestamp(),
      date: new Date().toISOString().split("T")[0],
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating focus session:", error)
    return id
  }
}

export const getTodaysSessions = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0]

  if (isDemo) {
    return demoData.focusSessions.filter((session: any) => session.userId === userId && session.date === today)
  }

  try {
    const q = query(collection(db, "focusSessions"), where("userId", "==", userId), where("date", "==", today))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting today sessions:", error)
    return []
  }
}

export const updateDailyStats = async (userId: string, focusTime: number) => {
  const today = new Date().toISOString().split("T")[0]
  const statsKey = `${userId}_${today}`

  if (isDemo) {
    if (!demoData.dailyStats[statsKey]) {
      demoData.dailyStats[statsKey] = {
        userId,
        date: today,
        sessionsCount: 0,
        totalFocusTime: 0,
        updatedAt: new Date(),
      }
    }
    demoData.dailyStats[statsKey].sessionsCount += 1
    demoData.dailyStats[statsKey].totalFocusTime += focusTime
    demoData.dailyStats[statsKey].updatedAt = new Date()
    return
  }

  try {
    const statsRef = doc(db, "dailyStats", statsKey)
    await setDoc(
      statsRef,
      {
        userId,
        date: today,
        sessionsCount: increment(1),
        totalFocusTime: increment(focusTime),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating daily stats:", error)
  }
}

// Todo Functions
export const createTodoItem = async (todoData: Omit<TodoItem, "id">) => {
  const id = generateId()

  if (isDemo) {
    demoData.todos.push({
      ...todoData,
      id,
      createdAt: new Date(),
    })
    return id
  }

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      ...todoData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating todo item:", error)
    return id
  }
}

export const getUserTodos = async (userId: string) => {
  if (isDemo) {
    return demoData.todos
      .filter((todo: any) => todo.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  try {
    const q = query(collection(db, "todos"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting user todos:", error)
    return []
  }
}

export const updateTodoItem = async (todoId: string, updates: Partial<TodoItem>) => {
  if (isDemo) {
    const todoIndex = demoData.todos.findIndex((todo: any) => todo.id === todoId)
    if (todoIndex !== -1) {
      demoData.todos[todoIndex] = { ...demoData.todos[todoIndex], ...updates }
    }
    return
  }

  try {
    await updateDoc(doc(db, "todos", todoId), updates)
  } catch (error) {
    console.error("Error updating todo item:", error)
  }
}

// Timeline Functions
export const createTimelineEntry = async (entryData: Omit<TimelineEntry, "id">) => {
  const id = generateId()

  if (isDemo) {
    demoData.timeline.push({
      ...entryData,
      id,
      createdAt: new Date(),
    })
    return id
  }

  try {
    const docRef = await addDoc(collection(db, "timeline"), {
      ...entryData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating timeline entry:", error)
    return id
  }
}

export const getUserTimeline = async (userId: string) => {
  if (isDemo) {
    return demoData.timeline
      .filter((entry: any) => entry.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  try {
    const q = query(collection(db, "timeline"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting user timeline:", error)
    return []
  }
}

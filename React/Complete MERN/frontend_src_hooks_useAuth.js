import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { loadUser } from "../slices/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user && !loading) {
      dispatch(loadUser())
    }
  }, [dispatch, user, loading])

  return { isAuthenticated, user, loading }
}


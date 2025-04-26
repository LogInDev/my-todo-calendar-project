import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '@/api/apiClient';
import { setUser } from '@/store/userSlice';

export default function useUser() {
  const dispatch = useDispatch();
  // user 상태가 없을 때만 API 호출
    const user = useSelector(state => state.user.user);

    useEffect(() => {
    if (!user) {
        apiClient.get('/api/users/me')
        .then((res) => {
            dispatch(setUser(res.data.data));
        })
        .catch((err) => {
            console.warn('유저 정보 조회 실패:', err);
        });
    }
    }, []);


}

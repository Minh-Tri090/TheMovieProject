import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/api';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import { FaCommentDots, FaTelegramPlane, FaArrowUp, FaArrowDown, FaReply, FaEllipsisH } from 'react-icons/fa';

export default function MovieDetail({ isWatchMode = false }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isWatching, setIsWatching] = useState(isWatchMode);
  const [lightsOff, setLightsOff] = useState(false);
  const [currentServer, setCurrentServer] = useState('VIP 1');
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const { toggleFavorite, isFavorite } = useFavorites() || {};
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const castRef    = useRef(null);
  const [castCanLeft,  setCastCanLeft]  = useState(false);
  const [castCanRight, setCastCanRight] = useState(true);

  useEffect(() => {
    if (isWatchMode) {
      if (!user) {
        toast.error('Vui lòng đăng nhập tài khoản Premium để xem phim!');
        navigate('/login');
      } else if (user.role !== 'premium' && user.role !== 'admin') {
        toast.error('Chỉ tài khoản Premium mới có thể xem phim!');
        navigate('/premium');
      } else {
        setIsWatching(true);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      setIsWatching(false);
    }
  }, [isWatchMode, id, user, navigate]);
  
  // States cho Comment
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyIsSpoiler, setReplyIsSpoiler] = useState(false);

  const handleVote = (id, type) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá.");
      return;
    }
    const processVote = (item) => {
      let newUserVote = item.userVote || 0;
      let newUpvotes = item.upvotes || 0;
      let newDownvotes = item.downvotes || 0;
      if (type === 'up') {
        if (newUserVote === 1) { newUserVote = 0; newUpvotes -= 1; }
        else {
          if (newUserVote === -1) newDownvotes -= 1;
          newUserVote = 1; newUpvotes += 1;
        }
      } else {
        if (newUserVote === -1) { newUserVote = 0; newDownvotes -= 1; }
        else {
          if (newUserVote === 1) newUpvotes -= 1;
          newUserVote = -1; newDownvotes += 1;
        }
      }
      return { ...item, userVote: newUserVote, upvotes: Math.max(0, newUpvotes), downvotes: Math.max(0, newDownvotes) };
    };

    setComments(prev => prev.map(c => {
      if (c.id === id) return processVote(c);
      if (c.replies && c.replies.some(r => r.id === id)) {
        return { ...c, replies: c.replies.map(r => r.id === id ? processVote(r) : r) };
      }
      return c;
    }));
  };

  const updateCastArrows = useCallback(() => {
    const el = castRef.current;
    if (!el) return;
    setCastCanLeft(el.scrollLeft > 4);
    setCastCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollCast = (dir) => {
    castRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  useEffect(() => {
    let mounted = true;
    getMovieById(id)
      .then((m) => {
        if (!mounted) return;
        setMovie(m);
        console.log('Movie detail payload:', m);
        console.log('Movie trailer field:', m.trailer);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Không tìm thấy phim.');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container page-section alert alert-info">Đang tải thông tin phim...</div>;
  if (error) return <div className="container page-section alert alert-error">{error}</div>;
  if (!movie) return null;

  const favorite = isFavorite ? isFavorite(movie.id) : false;

  return (
    <main className="site-main">
      {movie.backdrop && !isWatching && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
      )}
      {lightsOff && <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 999 }} />}
      
      <div className="container" style={{ position: 'relative', zIndex: lightsOff ? 1000 : 1 }}>
        {isWatching && (
          <div className="watch-section" style={{ marginBottom: '24px', background: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
            <div className="player-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
              <iframe
                title="Movie Player"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="player-toolbar" style={{ display: 'flex', gap: '8px', padding: '12px 16px', background: '#1e293b', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setLightsOff(!lightsOff)} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: lightsOff ? '#fbbf24' : '#334155', color: lightsOff ? '#000' : '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
              >
                💡 {lightsOff ? 'Bật đèn' : 'Tắt đèn'}
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#334155', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                ⏭ Tự chuyển tập: Bật
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#334155', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                ⚠️ Báo lỗi
              </button>
            </div>

            <div className="episode-list" style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#fbbf24' }}>☰</span> Phần 1
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Rút gọn <div style={{ width: '36px', height: '20px', background: 'transparent', border: '1px solid #fbbf24', borderRadius: '10px', position: 'relative' }}><div style={{ width: '12px', height: '12px', background: '#fbbf24', borderRadius: '50%', position: 'absolute', right: '4px', top: '3px' }}></div></div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {(() => {
                  const isSeries = movie.genres?.some(g => g.toLowerCase().includes('phim bộ') || g.toLowerCase().includes('tv') || g.toLowerCase().includes('series'));
                  const totalEps = movie.totalEpisodes || (isSeries ? 33 : 1);
                  
                  return Array.from({ length: totalEps }, (_, i) => i + 1).map(ep => (
                    <button 
                      key={ep}
                      onClick={() => setCurrentEpisode(ep)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '6px', background: currentEpisode === ep ? '#fbbf24' : 'rgba(30, 41, 59, 0.5)', color: currentEpisode === ep ? '#000' : '#cbd5e1', border: currentEpisode === ep ? 'none' : '1px solid rgba(148, 163, 184, 0.1)', cursor: 'pointer', fontWeight: currentEpisode === ep ? 'bold' : 'normal', fontSize: '0.9rem', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                      <FaPlay style={{ fontSize: '0.65rem', color: currentEpisode === ep ? '#000' : '#64748b' }}/>
                      <span style={{ marginLeft: '4px' }}>{totalEps === 1 ? 'Full' : `Tập ${ep}`}</span>
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        <section className="surface detail-surface">
          <div className="detail-layout">
            <div className="detail-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>
            <div className="detail-main">
              <div className="detail-header">
                <div>
                  <h1>{movie.title}</h1>
                  <p className="detail-meta">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.runtime && <span>{movie.runtime} phút</span>}
                    {movie.genres && movie.genres.length > 0 && (
                      <span>{movie.genres.join(' • ')}</span>
                    )}
                  </p>
                  <button
                    type="button"
                    className="detail-play-btn"
                    onClick={() => {
                      if (!user) {
                        toast.error('Vui lòng đăng nhập tài khoản Premium để xem phim!');
                        navigate('/login');
                        return;
                      }
                      if (user.role !== 'premium' && user.role !== 'admin') {
                        toast.error('Chỉ tài khoản Premium mới có thể xem phim!');
                        navigate('/premium');
                        return;
                      }

                      if (!isWatchMode) {
                        navigate(`/watch/${movie.id}`);
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <FaPlay /> Xem Ngay
                  </button>
                </div>
                <div className="detail-actions">
                  {movie.rating && (
                    <div className="detail-rating">
                      <span className="detail-rating-score">{movie.rating}</span>
                      <span className="detail-rating-label">/10 Rating</span>
                    </div>
                  )}
                  {movie.trailer ? (
                    <button
                      type="button"
                      className="detail-trailer-btn"
                      onClick={() => setShowTrailer(true)}
                    >
                      Xem trailer
                    </button>
                  ) : (
                    <div className="detail-no-trailer">
                      <a
                        className="detail-search-trailer"
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tìm trên YouTube
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    className={`detail-fav-btn ${favorite ? 'detail-fav-btn-active' : ''}`}
                    onClick={() => toggleFavorite && toggleFavorite(movie)}
                  >
                    {favorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  </button>
                </div>
              </div>
              <p className="detail-overview">{movie.overview}</p>
              <div className="detail-extra">
                {movie.releaseDate && (
                  <div className="detail-extra-item">
                    <span className="detail-extra-label">Ngày phát hành</span>
                    <span>{movie.releaseDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className="page-section">
              <h2 className="detail-section-title">Diễn viên</h2>
              <div className="detail-cast-wrapper">
                {castCanLeft && (
                  <button className="detail-cast-arrow detail-cast-arrow--left" onClick={() => scrollCast('left')} aria-label="Cuộn trái">
                    <FaChevronLeft />
                  </button>
                )}
                <div className="detail-cast-grid" ref={castRef} onScroll={updateCastArrows}>
                  {movie.cast.map((c) => (
                    <div key={c.id} className="detail-cast-card">
                      <img src={c.avatar} alt={c.name} className="detail-cast-avatar" />
                      <div className="detail-cast-name">{c.name}</div>
                      {c.character && <div className="detail-cast-character">{c.character}</div>}
                    </div>
                  ))}
                </div>
                {castCanRight && (
                  <button className="detail-cast-arrow detail-cast-arrow--right" onClick={() => scrollCast('right')} aria-label="Cuộn phải">
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* --- COMMENTS SECTION --- */}
          <div className="page-section comments-section">
            <h2 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCommentDots /> Bình luận ({comments.length})
            </h2>
            
            {!user ? (
              <p className="login-prompt" style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px' }}>
                Vui lòng <span onClick={() => navigate('/login')} style={{ color: '#fbbf24', cursor: 'pointer', fontWeight: 'bold' }}>đăng nhập</span> để tham gia bình luận.
              </p>
            ) : null}

            <div className="comment-input-box" style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', overflow: 'hidden', opacity: user ? 1 : 0.6, pointerEvents: user ? 'auto' : 'none' }}>
              <div style={{ position: 'relative' }}>
                <textarea 
                  style={{ width: '100%', minHeight: '100px', padding: '16px', background: 'transparent', border: 'none', color: '#e5e7eb', resize: 'none', outline: 'none' }}
                  placeholder="Viết bình luận"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={1000}
                  disabled={!user}
                />
                <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.75rem', color: '#9ca3af' }}>
                  {commentText.length} / 1000
                </span>
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <div onClick={() => setIsSpoiler(!isSpoiler)} style={{ width: '36px', height: '20px', background: isSpoiler ? '#fbbf24' : 'rgba(255,255,255,0.1)', borderRadius: '999px', position: 'relative', transition: '0.2s', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ width: '14px', height: '14px', background: isSpoiler ? '#1f2937' : '#9ca3af', borderRadius: '50%', position: 'absolute', top: '2px', left: isSpoiler ? '18px' : '2px', transition: '0.2s' }} />
                  </div>
                  Tiết lộ?
                </label>
                <button 
                  style={{ background: 'transparent', border: 'none', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: commentText.trim() ? 1 : 0.5 }}
                  disabled={!user || !commentText.trim()}
                  onClick={() => { 
                    const newComment = {
                      id: Date.now(),
                      user: user?.username || user?.email || "Người dùng",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.username || Date.now()),
                      text: commentText,
                      isSpoiler,
                      time: "Vừa xong",
                      badge: "P.1 - Tập 1",
                      upvotes: 0,
                      downvotes: 0,
                      userVote: 0
                    };
                    setComments([newComment, ...comments]);
                    setCommentText(""); 
                    setIsSpoiler(false);
                    toast.success("Đã gửi bình luận!"); 
                  }}
                >
                  Gửi <FaTelegramPlane style={{ fontSize: '1.2rem' }} />
                </button>
              </div>
            </div>

            {comments.length > 0 ? (
              <div className="comments-list" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {comments.map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: '16px' }}>
                    <img src={c.avatar} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', background: '#334155' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ border: '1px solid #22c55e', color: '#22c55e', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>ROX</span>
                        <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{c.user}</strong>
                        <span style={{ color: '#fbbf24', fontSize: '1rem', lineHeight: 1 }}>∞</span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{c.time}</span>
                        <span style={{ border: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{c.badge}</span>
                      </div>
                      <div style={{ margin: '0 0 12px 0' }}>
                        <p style={{ 
                          color: '#cbd5e1', 
                          fontSize: '1rem', 
                          margin: 0, 
                          lineHeight: 1.5,
                          filter: (c.isSpoiler && !revealedSpoilers.includes(c.id)) ? 'blur(4px)' : 'none',
                          transition: 'filter 0.3s ease',
                          userSelect: (c.isSpoiler && !revealedSpoilers.includes(c.id)) ? 'none' : 'auto'
                        }}>
                          {c.text}
                        </p>
                        {c.isSpoiler && !revealedSpoilers.includes(c.id) && (
                          <div 
                            style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '8px', cursor: 'pointer', display: 'inline-block' }}
                            onClick={() => setRevealedSpoilers([...revealedSpoilers, c.id])}
                          >
                            Xem
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.9rem' }}>
                        <span onClick={() => handleVote(c.id, 'up')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.2s', color: c.userVote === 1 ? '#22c55e' : 'inherit' }}>
                          <FaArrowUp style={{ background: c.userVote === 1 ? '#22c55e' : 'rgba(255,255,255,0.05)', color: c.userVote === 1 ? '#000' : 'inherit', padding: '6px', borderRadius: '50%', fontSize: '1.4rem'}} />
                          {c.upvotes > 0 && <span style={{ fontWeight: 'bold' }}>{c.upvotes}</span>}
                        </span>
                        <span onClick={() => handleVote(c.id, 'down')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.2s', color: c.userVote === -1 ? '#ef4444' : 'inherit' }}>
                          <FaArrowDown style={{ background: c.userVote === -1 ? '#ef4444' : 'rgba(255,255,255,0.05)', color: c.userVote === -1 ? '#000' : 'inherit', padding: '6px', borderRadius: '50%', fontSize: '1.4rem'}} />
                          {c.downvotes > 0 && <span style={{ fontWeight: 'bold' }}>{c.downvotes}</span>}
                        </span>
                        <span onClick={() => user ? setReplyingTo(replyingTo === c.id ? null : c.id) : toast.error('Vui lòng đăng nhập để trả lời')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><FaReply /> Trả lời</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><FaEllipsisH /> Thêm</span>
                      </div>
                      
                      {replyingTo === c.id && (
                        <div className="comment-input-box" style={{ marginTop: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', overflow: 'hidden' }}>
                          <div style={{ position: 'relative' }}>
                            <textarea 
                              style={{ width: '100%', minHeight: '80px', padding: '16px', background: 'transparent', border: 'none', color: '#e5e7eb', resize: 'none', outline: 'none', fontSize: '0.9rem' }}
                              placeholder="Viết bình luận"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              maxLength={1000}
                            />
                            <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.75rem', color: '#9ca3af' }}>
                              {replyText.length} / 1000
                            </span>
                          </div>
                          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <div onClick={() => setReplyIsSpoiler(!replyIsSpoiler)} style={{ width: '36px', height: '20px', background: replyIsSpoiler ? '#fbbf24' : 'rgba(255,255,255,0.1)', borderRadius: '999px', position: 'relative', transition: '0.2s', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <div style={{ width: '14px', height: '14px', background: replyIsSpoiler ? '#1f2937' : '#9ca3af', borderRadius: '50%', position: 'absolute', top: '2px', left: replyIsSpoiler ? '18px' : '2px', transition: '0.2s' }} />
                              </div>
                              Tiết lộ?
                            </label>
                            <button 
                              style={{ background: 'transparent', border: 'none', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: replyText.trim() ? 1 : 0.5 }}
                              disabled={!replyText.trim()}
                              onClick={() => { 
                                const newReply = {
                                  id: Date.now(),
                                  user: user?.username || user?.email || "Người dùng",
                                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.username || Date.now() + 1),
                                  text: replyText,
                                  isSpoiler: replyIsSpoiler,
                                  time: "Vừa xong",
                                  badge: "P.1 - Tập 1",
                                  upvotes: 0,
                                  downvotes: 0,
                                  userVote: 0
                                };
                                setComments(prev => prev.map(cmt => cmt.id === c.id ? { ...cmt, replies: [...(cmt.replies || []), newReply] } : cmt));
                                toast.success("Đã gửi phản hồi!"); 
                                setReplyingTo(null);
                                setReplyText("");
                                setReplyIsSpoiler(false);
                              }}
                            >
                              Gửi <FaTelegramPlane style={{ fontSize: '1.2rem' }} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {c.replies.map((r) => (
                            <div key={r.id} style={{ display: 'flex', gap: '12px', marginLeft: '32px' }}>
                              <img src={r.avatar} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#334155' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ border: '1px solid #22c55e', color: '#22c55e', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>ROX</span>
                                  <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>{r.user}</strong>
                                  <span style={{ color: '#fbbf24', fontSize: '0.95rem', lineHeight: 1 }}>∞</span>
                                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.time}</span>
                                  <span style={{ border: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>{r.badge}</span>
                                </div>
                                <div style={{ margin: '0 0 10px 0' }}>
                                  <p style={{ 
                                    color: '#cbd5e1', 
                                    fontSize: '0.95rem', 
                                    margin: 0, 
                                    lineHeight: 1.5,
                                    filter: (r.isSpoiler && !revealedSpoilers.includes(r.id)) ? 'blur(4px)' : 'none',
                                    transition: 'filter 0.3s ease',
                                    userSelect: (r.isSpoiler && !revealedSpoilers.includes(r.id)) ? 'none' : 'auto'
                                  }}>
                                    {r.text}
                                  </p>
                                  {r.isSpoiler && !revealedSpoilers.includes(r.id) && (
                                    <div 
                                      style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '6px', cursor: 'pointer', display: 'inline-block' }}
                                      onClick={() => setRevealedSpoilers([...revealedSpoilers, r.id])}
                                    >
                                      Xem
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                                  <span onClick={() => handleVote(r.id, 'up')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.2s', color: r.userVote === 1 ? '#22c55e' : 'inherit' }}>
                                    <FaArrowUp style={{ background: r.userVote === 1 ? '#22c55e' : 'rgba(255,255,255,0.05)', color: r.userVote === 1 ? '#000' : 'inherit', padding: '5px', borderRadius: '50%', fontSize: '1.2rem'}} />
                                    {r.upvotes > 0 && <span style={{ fontWeight: 'bold' }}>{r.upvotes}</span>}
                                  </span>
                                  <span onClick={() => handleVote(r.id, 'down')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.2s', color: r.userVote === -1 ? '#ef4444' : 'inherit' }}>
                                    <FaArrowDown style={{ background: r.userVote === -1 ? '#ef4444' : 'rgba(255,255,255,0.05)', color: r.userVote === -1 ? '#000' : 'inherit', padding: '5px', borderRadius: '50%', fontSize: '1.2rem'}} />
                                    {r.downvotes > 0 && <span style={{ fontWeight: 'bold' }}>{r.downvotes}</span>}
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => user ? setReplyingTo(replyingTo === c.id ? null : c.id) : toast.error('Vui lòng đăng nhập để trả lời')}><FaReply /> Trả lời</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><FaEllipsisH /> Thêm</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-comments" style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', marginTop: '24px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <FaCommentDots style={{ fontSize: '3.5rem', color: '#475569', marginBottom: '12px' }} />
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>Chưa có bình luận nào</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {showTrailer && movie.trailer && (
        <div className="trailer-modal" role="dialog" aria-label="Trailer">
          <div className="trailer-modal-backdrop" onClick={() => setShowTrailer(false)} />
          <div className="trailer-modal-content">
            <button type="button" className="trailer-close" onClick={() => setShowTrailer(false)}>×</button>
            <iframe
              title="Trailer"
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${movie.trailer.key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}

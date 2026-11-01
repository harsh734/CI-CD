import { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { completeOnboardingThunk } from '../../redux/authSlice';
import { tourFinished } from '../../redux/onboardingSlice';

const STEPS = [
  {
    target: null,
    placement: 'center',
    icon: '👋',
    title: 'Chào mừng đến với TaskFlow!',
    content: 'Hãy cùng khám phá các tính năng chính trong khoảng 1 phút nhé.',
    route: '/',
  },
  {
    target: '.stat-card',
    placement: 'bottom',
    icon: '📊',
    title: 'Thống kê công việc',
    content: 'Tổng quan task của bạn: tổng số, đang làm, đã hoàn thành và tỷ lệ hoàn thành.',
    route: '/',
  },
  {
    target: '.sidebar-item',
    placement: 'right',
    icon: '🗂',
    title: 'Danh mục',
    content: 'Sidebar giúp lọc nhanh task theo: Công việc, Cá nhân, Sức khỏe, Học tập, Mua sắm.',
    route: '/',
  },
  {
    target: '.theme-toggle',
    placement: 'bottom',
    icon: '🌗',
    title: 'Đổi giao diện',
    content: 'Bấm vào đây để đổi giữa giao diện sáng và tối.',
    route: '/',
  },
  {
    target: '.navbar-link[href="/tasks"]',
    placement: 'bottom',
    icon: '📋',
    title: 'Quản lý task',
    content: 'Bấm "Tiếp" để chuyển sang trang Tasks — nơi bạn tạo, sửa, và quản lý toàn bộ công việc.',
    route: '/',
  },
  {
    target: '.task-input-form',
    placement: 'bottom',
    icon: '✍️',
    title: 'Tạo task mới',
    content: 'Nhập tiêu đề, chọn mức ưu tiên và danh mục, sau đó bấm thêm để tạo task.',
    route: '/tasks',
  },
  {
    target: '.search-input',
    placement: 'bottom',
    icon: '🔍',
    title: 'Tìm kiếm & lọc',
    content: 'Tìm task theo từ khóa, hoặc lọc theo mức ưu tiên.',
    route: '/tasks',
  },
  {
    target: '.task-card',
    placement: 'top',
    icon: '✅',
    title: 'Thao tác với task',
    content: 'Bấm checkbox để hoàn thành, hoặc dùng các nút bên phải để sửa, xóa task.',
    route: '/tasks',
  },
  {
    target: null,
    placement: 'center',
    icon: '🎉',
    title: 'Xong rồi!',
    content: 'Bạn đã sẵn sàng sử dụng TaskFlow. Có thể xem lại hướng dẫn này bất cứ lúc nào ở Cài đặt.',
    route: '/tasks',
  },
];

const PADDING = 8;
const TOOLTIP_GAP = 16;
const TOOLTIP_W = 360;

function computeTooltipPos(rect, placement, viewport) {
  if (!rect) {
    return {
      top: viewport.h / 2 - 140,
      left: viewport.w / 2 - TOOLTIP_W / 2,
      placement: 'center',
    };
  }
  const positions = {
    bottom: { top: rect.bottom + TOOLTIP_GAP, left: rect.left + rect.width / 2 - TOOLTIP_W / 2 },
    top:    { top: rect.top - TOOLTIP_GAP - 220, left: rect.left + rect.width / 2 - TOOLTIP_W / 2 },
    right:  { top: rect.top + rect.height / 2 - 110, left: rect.right + TOOLTIP_GAP },
    left:   { top: rect.top + rect.height / 2 - 110, left: rect.left - TOOLTIP_GAP - TOOLTIP_W },
  };
  let pos = positions[placement] || positions.bottom;
  let used = placement;

  if (pos.top < 16 || pos.left < 16 || pos.left + TOOLTIP_W > viewport.w - 16 || pos.top + 220 > viewport.h - 16) {
    for (const alt of ['bottom', 'top', 'right', 'left']) {
      const p = positions[alt];
      if (p.top >= 16 && p.left >= 16 && p.left + TOOLTIP_W <= viewport.w - 16 && p.top + 220 <= viewport.h - 16) {
        pos = p; used = alt; break;
      }
    }
  }
  pos.left = Math.max(16, Math.min(pos.left, viewport.w - TOOLTIP_W - 16));
  pos.top = Math.max(16, Math.min(pos.top, viewport.h - 220 - 16));
  return { ...pos, placement: used };
}

export default function OnboardingTour() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const forceStart = useSelector((s) => s.onboarding.forceStart);

  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lastForceStart, setLastForceStart] = useState(forceStart);
  const [targetRect, setTargetRect] = useState(null);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  if (forceStart && !lastForceStart) {
    setStepIndex(0);
    setCompleted(false);
    setPaused(false);
    setDelayElapsed(false);
    setLastForceStart(true);
  } else if (!forceStart && lastForceStart) {
    setLastForceStart(false);
  }

  const shouldRun = useMemo(() => {
    if (!user) return false;
    if (completed) return false;
    return forceStart || !user.onboardingCompleted;
  }, [user, forceStart, completed]);

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  // Navigate to step's required route
  useEffect(() => {
    if (!shouldRun || !step) return;
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
    }
  }, [shouldRun, step, location.pathname, navigate]);

  // Delay show on mount/restart
  useEffect(() => {
    if (!shouldRun) return undefined;
    const t = setTimeout(() => setDelayElapsed(true), 250);
    return () => clearTimeout(t);
  }, [shouldRun]);

  // Track viewport size
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Measure target rect with scroll/resize updates
  useLayoutEffect(() => {
    if (!shouldRun || !delayElapsed || paused) return undefined;
    if (!step.target) return undefined;

    let raf = 0;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const el = document.querySelector(step.target);
      if (!el) {
        setTargetRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right });
    };

    // Scroll target into view first
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    // Re-measure on a loop briefly while scroll animates
    let ticks = 0;
    const tick = () => {
      measure();
      ticks += 1;
      if (ticks < 20 && !cancelled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onChange = () => { measure(); };
    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange, true);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onChange);
      window.removeEventListener('scroll', onChange, true);
    };
  }, [shouldRun, delayElapsed, paused, stepIndex, step, location.pathname]);

  const finish = useCallback(() => {
    setCompleted(true);
    if (user && !user.onboardingCompleted) dispatch(completeOnboardingThunk());
    dispatch(tourFinished());
  }, [user, dispatch]);

  const goNext = useCallback(() => {
    if (isLast) { finish(); return; }
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep.route && nextStep.route !== location.pathname) {
      setPaused(true);
      navigate(nextStep.route);
      setStepIndex((i) => i + 1);
      setTimeout(() => setPaused(false), 400);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [isLast, finish, stepIndex, location.pathname, navigate]);

  const goBack = useCallback(() => {
    if (isFirst) return;
    const prevStep = STEPS[stepIndex - 1];
    if (prevStep.route && prevStep.route !== location.pathname) {
      setPaused(true);
      navigate(prevStep.route);
      setStepIndex((i) => i - 1);
      setTimeout(() => setPaused(false), 400);
    } else {
      setStepIndex((i) => i - 1);
    }
  }, [isFirst, stepIndex, location.pathname, navigate]);

  useEffect(() => {
    if (!shouldRun || paused) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      else if (e.key === 'ArrowLeft') goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shouldRun, paused, finish, goNext, goBack]);

  if (!shouldRun || !delayElapsed) return null;

  const effectiveRect = step.target ? targetRect : null;
  const tooltipPos = computeTooltipPos(effectiveRect, step.placement, viewport);
  const hasTarget = !!effectiveRect;

  const spotlightRect = hasTarget
    ? {
        x: Math.max(0, effectiveRect.left - PADDING),
        y: Math.max(0, effectiveRect.top - PADDING),
        w: effectiveRect.width + PADDING * 2,
        h: effectiveRect.height + PADDING * 2,
      }
    : null;

  return createPortal(
    <div className="ot-root" role="dialog" aria-modal="true" aria-label="Hướng dẫn sử dụng">
      {/* Overlay with spotlight cutout */}
      <svg className="ot-overlay" width="100%" height="100%">
        <defs>
          <mask id="ot-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.x}
                y={spotlightRect.y}
                width={spotlightRect.w}
                height={spotlightRect.h}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(8,8,16,0.72)" mask="url(#ot-mask)" />
      </svg>

      {/* Spotlight ring */}
      {spotlightRect && (
        <div
          className="ot-spotlight-ring"
          style={{
            top: spotlightRect.y,
            left: spotlightRect.x,
            width: spotlightRect.w,
            height: spotlightRect.h,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`ot-tooltip ot-placement-${tooltipPos.placement}`}
        style={{ top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_W }}
      >
        {hasTarget && tooltipPos.placement !== 'center' && (
          <div className={`ot-arrow ot-arrow-${tooltipPos.placement}`} />
        )}

        <div className="ot-progress">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`ot-dot ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}
            />
          ))}
          <span className="ot-counter">{stepIndex + 1}/{STEPS.length}</span>
        </div>

        <div className="ot-body">
          <div className="ot-title">
            <span className="ot-icon">{step.icon}</span>
            <span>{step.title}</span>
          </div>
          <p className="ot-content">{step.content}</p>
        </div>

        <div className="ot-footer">
          <button className="ot-btn ot-btn-ghost" onClick={finish}>Bỏ qua</button>
          <div className="ot-nav">
            {!isFirst && (
              <button className="ot-btn ot-btn-secondary" onClick={goBack}>← Quay lại</button>
            )}
            <button className="ot-btn ot-btn-primary" onClick={goNext}>
              {isLast ? 'Hoàn thành 🎉' : 'Tiếp →'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

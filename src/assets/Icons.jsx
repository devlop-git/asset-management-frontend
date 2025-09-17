const ICONS = {
  edit: {
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: [
      { d: 'M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z' },
      { d: 'M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z' }
    ]
  },
  delete: {
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: [
      { d: 'M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z' }
    ]
  },
  add: {
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: [
      { d: 'M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z' }
    ]
  },
  admin: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.378.313.696.66.87.349.174.766.184 1.125.028l1.179-.49a1.125 1.125 0 011.37.49l1.296 2.247c.25.433.168.98-.205 1.326l-.987.906c-.29.267-.42.66-.33 1.04.09.38.37.69.74.802l1.28.382c.52.155.86.65.82 1.19l-.19 2.59c-.04.54-.46.97-1 .998l-1.284.06c-.385.018-.735.226-.93.56-.196.334-.21.744-.036 1.09l.56 1.147c.246.506.065 1.115-.416 1.42l-2.24 1.4a1.125 1.125 0 01-1.407-.19l-.887-.95a1.125 1.125 0 00-1.02-.31c-.36.07-.717.106-1.074.106-.357 0-.714-.036-1.074-.106a1.125 1.125 0 00-1.02.31l-.887.95a1.125 1.125 0 01-1.407.19l-2.24-1.4a1.125 1.125 0 01-.416-1.42l.56-1.147c.174-.346.16-.756-.036-1.09a1.125 1.125 0 00-.93-.56l-1.284-.06a1.012 1.012 0 01-1-.999l-.19-2.59a1.125 1.125 0 01.82-1.19l1.28-.382c.37-.111.65-.422.74-.802.09-.38-.04-.773-.33-1.04l-.987-.906a1.125 1.125 0 01-.205-1.326l1.296-2.247a1.125 1.125 0 011.37-.49l1.179.49c.36.156.776.146 1.125-.028.347-.174.597-.492.66-.87l.213-1.28z', strokeLinecap: 'round', strokeLinejoin: 'round' },
      { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  },
  stock: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h16.5M3.75 18.75h16.5', strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  },
  role: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' }
    ]
  },
  logout: {
    viewBox: '0 0 16 16',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3' }
    ]
  },
  close: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M6 18L18 6M6 6l12 12' }
    ]
  },
  filter: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 2,
    paths: [
      { d: 'M4 6h16M7 12h10M10 18h4', strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  },
  check: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    defaultStrokeWidth: 1.5,
    paths: [
      { d: 'M4.5 12.75l6 6 9-13.5' }
    ]
  }
};

export const Icon = ({ name, size = 24, color = 'currentColor', className = '', strokeWidth, ...props }) => {
  const def = ICONS[name];
  if (!def) return null;
  const isStroke = def.mode === 'stroke';
  const computedStrokeWidth = strokeWidth ?? def.defaultStrokeWidth;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={def.viewBox}
      width={size}
      height={size}
      className={className}
      fill={isStroke ? 'none' : color}
      stroke={isStroke ? color : 'none'}
      strokeWidth={isStroke ? computedStrokeWidth : undefined}
      aria-hidden="true"
      {...props}
    >
      {def.paths.map((p, idx) => (
        <path key={idx} d={p.d} strokeLinecap={p.strokeLinecap} strokeLinejoin={p.strokeLinejoin} />
      ))}
    </svg>
  );
};

// Backwards-compatible wrappers (optional)
export const Edit = (props) => <Icon name="edit" size={24} className={props?.className ?? 'w-6 h-6'} {...props} />;
export const Delete = (props) => <Icon name="delete" size={24} className={props?.className ?? 'w-6 h-6'} {...props} />;
export const Add = (props) => <Icon name="add" size={24} className={props?.className ?? 'w-6 h-6'} {...props} />;
export const AdminIcon = (props) => <Icon name="admin" size={20} className={props?.className ?? 'w-5 h-5'} {...props} />;
export const StockIcon = (props) => <Icon name="stock" size={20} className={props?.className ?? 'w-5 h-5'} {...props} />;
export const RoleIcon = (props) => <Icon name="role" size={20} className={props?.className ?? 'w-5 h-5'} {...props} />;
export const Logout = (props) => <Icon name="logout" size={24} className={props?.className ?? 'w-6 h-6'} {...props} />;
export const Close = (props) => <Icon name="close" size={16} className={props?.className ?? 'w-4 h-4'} {...props} />;
export const FilterIcon = (props) => <Icon name="filter" size={16} className={props?.className ?? 'w-4 h-4'} {...props} />;
export const CheckIcon = (props) => <Icon name="check" size={16} className={props?.className ?? 'w-4 h-4'} {...props} />;

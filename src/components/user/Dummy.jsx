import { useNode } from '@craftjs/core';

export function Dummy() {
  const {
    connectors: {connect, drag}
  } = useNode()
  return (
    <div
      ref={dom=>connect(dom)}
    >dummy!
    </div>
  )
}

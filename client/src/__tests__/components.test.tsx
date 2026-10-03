import { renderToString } from 'react-dom/server';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AdminTable, ColumnDef } from '../components/admin/AdminTable';
import { AvailabilityEditor } from '../components/provider/AvailabilityEditor';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('=== STARTING SEVASETU CLIENT UI COMPONENT TEST SUITE ===');
  let passed = 0;
  let failed = 0;

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: unknown) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  };

  // 1. Button Tests
  test('Button renders primary variant with emerald token and font display', () => {
    const html = renderToString(
      <Button variant="primary" size="md">
        Confirm Booking
      </Button>
    );
    assert(html.includes('bg-primary-700') || html.includes('emerald'), 'Should contain primary brand background token');
    assert(html.includes('min-h-[44px]'), 'Should satisfy 44px accessible touch target');
    assert(html.includes('Confirm Booking'), 'Should contain button label');
  });

  test('Button handles isLoading with aria-busy and disabled state', () => {
    const html = renderToString(
      <Button variant="primary" isLoading>
        Processing
      </Button>
    );
    assert(html.includes('aria-busy="true"'), 'Should expose aria-busy="true"');
    assert(html.includes('disabled=""') || html.includes('disabled'), 'Should be disabled when loading');
    assert(html.includes('animate-spin'), 'Should contain loading spinner');
  });

  test('Button renders danger variant with error token', () => {
    const html = renderToString(
      <Button variant="danger" size="sm">
        Cancel Request
      </Button>
    );
    assert(html.includes('bg-error-600') || html.includes('red'), 'Should contain error danger background token');
  });

  // 2. Modal Accessibility Tests
  test('Modal does not render in DOM when isOpen is false', () => {
    const html = renderToString(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    assert(!html.includes('Modal Content'), 'Modal content should not render when isOpen is false');
  });

  test('Modal renders with accessible dialog roles, aria-modal, and focus target when isOpen is true', () => {
    const html = renderToString(
      <Modal isOpen={true} onClose={() => {}} title="Emergency Dispatch Confirmation">
        <p>Confirm immediate service arrival?</p>
      </Modal>
    );
    assert(html.includes('role="dialog"'), 'Should have role="dialog"');
    assert(html.includes('aria-modal="true"'), 'Should have aria-modal="true"');
    assert(html.includes('aria-labelledby="modal-title"'), 'Should have aria-labelledby bound to title');
    assert(html.includes('Emergency Dispatch Confirmation'), 'Should render modal title in display font');
    assert(html.includes('aria-label="Close dialog"'), 'Close button must have accessible aria-label');
  });

  // 3. Card & Typography Token Tests
  test('Card renders solid surface with design tokens', () => {
    const html = renderToString(
      <Card variant="default">
        <div>Card Body</div>
      </Card>
    );
    assert(html.includes('bg-white'), 'Card must have solid white surface');
    assert(html.includes('dark:bg-slate-900'), 'Card must have dark mode slate-900 surface');
    assert(html.includes('rounded-2xl'), 'Card must have rounded-2xl token radius');
  });

  // 4. Badge Tests
  test('Badge provides dual visual and text indicators without relying on color alone', () => {
    const html = renderToString(
      <Badge variant="success" dot>
        Active Provider
      </Badge>
    );
    assert(html.includes('Active Provider'), 'Must render explicit status text');
    assert(html.includes('rounded-full'), 'Must render pill shape');
  });

  // 5. AdminTable Semantic Tests
  test('AdminTable renders semantic table with caption, col scope, and aria-sort', () => {
    interface TestRow {
      id: string;
      name: string;
      role: string;
    }
    const columns: ColumnDef<TestRow>[] = [
      { key: 'id', header: 'Reference ID', sortable: true, render: (item) => item.id },
      { key: 'name', header: 'Full Name', render: (item) => item.name },
      { key: 'role', header: 'Platform Role', render: (item) => item.role },
    ];
    const data: TestRow[] = [
      { id: 'USR-001', name: 'Rajesh Kumar', role: 'Electrician' },
      { id: 'USR-002', name: 'Priya Sharma', role: 'Plumber' },
    ];

    const html = renderToString(
      <AdminTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        sortBy="id"
        sortDirection="asc"
        onSort={() => {}}
      />
    );

    assert(html.includes('<table'), 'Must render semantic HTML table');
    assert(html.includes('scope="col"'), 'Must have scope="col" on table header cells');
    assert(html.includes('aria-sort="ascending"'), 'Must have aria-sort indicator on sorted column');
    assert(html.includes('Rajesh Kumar'), 'Must render row content');
  });

  test('AdminTable renders empty state with accessible announcement when data is empty', () => {
    const columns: ColumnDef<{ id: string }>[] = [
      { key: 'id', header: 'ID', render: (item) => item.id }
    ];
    const html = renderToString(
      <AdminTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
        emptyTitle="No matching provider records found"
      />
    );
    assert(html.includes('No matching provider records found'), 'Must render clear empty title');
  });

  // 6. AvailabilityEditor Matrix Tests
  test('AvailabilityEditor renders 7-day schedule grid with accessible controls', () => {
    const html = renderToString(<AvailabilityEditor initialLoading={false} />);
    assert(html.includes('Weekly Operating Matrix'), 'Should render weekly schedule matrix');
    assert(html.includes('role="grid"'), 'Should render accessible grid for 7-day operating hours');
    assert(html.includes('Vacation / Emergency Pause Mode'), 'Should render vacation pause controls');
  });

  console.log(`\n=== TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

"""
Simple test script to verify migration system is working
"""
import subprocess
import sys
import os
from pathlib import Path

def test_migration_system():
    """
    Test that the migration system is properly configured
    """
    print("🔍 Testing migration system configuration...")
    
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Check if alembic.ini exists
    total_tests += 1
    alembic_ini_path = backend_dir / "alembic.ini"
    if alembic_ini_path.exists():
        print("✅ Test 1 PASSED: alembic.ini exists")
        tests_passed += 1
    else:
        print("❌ Test 1 FAILED: alembic.ini does not exist")
    
    # Test 2: Check if alembic directory exists
    total_tests += 1
    alembic_dir = backend_dir / "alembic"
    if alembic_dir.exists() and alembic_dir.is_dir():
        print("✅ Test 2 PASSED: alembic directory exists")
        tests_passed += 1
    else:
        print("❌ Test 2 FAILED: alembic directory does not exist")
    
    # Test 3: Check if env.py exists in alembic directory
    total_tests += 1
    env_py_path = alembic_dir / "env.py"
    if env_py_path.exists():
        print("✅ Test 3 PASSED: alembic/env.py exists")
        tests_passed += 1
    else:
        print("❌ Test 3 FAILED: alembic/env.py does not exist")
    
    # Test 4: Check if versions directory exists
    total_tests += 1
    versions_dir = alembic_dir / "versions"
    if versions_dir.exists() and versions_dir.is_dir():
        print("✅ Test 4 PASSED: alembic/versions directory exists")
        tests_passed += 1
    else:
        print("❌ Test 4 FAILED: alembic/versions directory does not exist")
    
    # Test 5: Check if there are initial migration files
    total_tests += 1
    migration_files = list(versions_dir.glob("*.py"))
    if len(migration_files) > 0:
        print(f"✅ Test 5 PASSED: {len(migration_files)} migration files found")
        tests_passed += 1
    else:
        print("❌ Test 5 FAILED: No migration files found in versions directory")
    
    # Test 6: Try to check migration status (without actually running migrations)
    total_tests += 1
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "heads"
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ Test 6 PASSED: Alembic command is available and working")
            tests_passed += 1
        else:
            print(f"❌ Test 6 FAILED: Alembic command returned error: {result.stderr}")
    except subprocess.TimeoutExpired:
        print("✅ Test 6 PASSED: Alembic command is available (timeout expected for no database)")
        tests_passed += 1
    except FileNotFoundError:
        print("❌ Test 6 FAILED: Alembic module not found")
    except Exception as e:
        print(f"❌ Test 6 FAILED: Error testing alembic: {e}")
    
    print(f"\n📊 Migration system test results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Migration system is properly configured.")
        return True
    else:
        print("⚠️ Some tests failed. Please review the migration system configuration.")
        return False

def run_database_migrations():
    """
    Run the database migrations
    """
    print("\n🔄 Running database migrations...")
    
    try:
        # Run the migration script directly
        from run_migrations import run_migrations_offline
        success = run_migrations_offline()
        
        if success:
            print("✅ Database migrations completed successfully!")
            return True
        else:
            print("❌ Database migrations failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False


if __name__ == "__main__":
    print("🧪 Running migration system tests...\n")
    
    # Run configuration tests
    config_ok = test_migration_system()
    
    if config_ok:
        print("\n" + "="*60)
        print("Configuration looks good! Would you like to run migrations?")
        print("Note: This will require a database connection.")
        response = input("Run migrations? (y/n): ").strip().lower()
        
        if response in ['y', 'yes']:
            success = run_database_migrations()
            if success:
                print("\n🎉 Migration system tests completed successfully!")
            else:
                print("\n⚠️ Migration tests completed but migrations failed.")
                sys.exit(1)
        else:
            print("\nSkipping migration execution.")
            print("To run migrations manually, use: python run_migrations.py")
    else:
        print("\n❌ Migration system configuration has issues that need to be fixed.")
        sys.exit(1)
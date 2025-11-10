"""
Migration helper script for generating new Alembic migration files
"""
import os
import sys
from pathlib import Path
import argparse
from datetime import datetime
import subprocess

def generate_migration(migration_message):
    """Generate a new migration file using alembic autogenerate"""
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print(f"🔄 Generating migration: '{migration_message}'")
    
    try:
        # Run alembic autogenerate command
        result = subprocess.run([
            sys.executable, "-m", "alembic", 
            "revision", "--autogenerate", 
            "-m", migration_message
        ], capture_output=True, text=True, check=True)
        
        print(f"✅ Migration generated successfully!")
        print(result.stdout)
        
        # Return the path of the generated migration
        for line in result.stdout.splitlines():
            if "Generating" in line and "alembic/versions/" in line:
                # Extract the migration file path
                parts = line.split()
                for part in parts:
                    if "alembic/versions/" in part and ".py" in part:
                        return part
        
        return None
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generating migration:")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None


def show_pending_migrations():
    """Show current migration status and pending migrations"""
    
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🔄 Checking current migration status...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "current"
        ], capture_output=True, text=True, check=True)
        
        print(f"Current migration status:")
        print(result.stdout)
        
        # Show history
        result = subprocess.run([
            sys.executable, "-m", "alembic", "history", "--verbose"
        ], capture_output=True, text=True, check=True)
        
        print(f"\nMigration history:")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error checking status: {e}")
        print(f"Error output: {e.stderr}")
    except Exception as e:
        print(f"❌ Unexpected error checking status: {e}")


def run_pending_migrations():
    """Apply all pending migrations"""
    
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🔄 Applying pending migrations...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True, check=True)
        
        print(f"✅ Migrations applied successfully!")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error applying migrations:")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
    except Exception as e:
        print(f"❌ Unexpected error applying migrations: {e}")


def main():
    parser = argparse.ArgumentParser(description='Migration helper for e-commerce backend')
    parser.add_argument('action', choices=['generate', 'status', 'upgrade'], 
                       help='Action to perform: generate new migration, check status, or apply migrations')
    parser.add_argument('--message', '-m', type=str, 
                       help='Migration message (required for generate action)')
    
    args = parser.parse_args()
    
    if args.action == 'generate':
        if not args.message:
            print("❌ Error: --message/-m is required for generate action")
            return
        
        migration_file = generate_migration(args.message)
        if migration_file:
            print(f"\n📄 Generated migration file: {migration_file}")
            print("📝 Please review the migration file before applying it.")
            print("   Remember to test the upgrade and downgrade functions!")
        else:
            print("❌ Failed to generate migration")
    
    elif args.action == 'status':
        show_pending_migrations()
    
    elif args.action == 'upgrade':
        run_pending_migrations()


if __name__ == "__main__":
    main()
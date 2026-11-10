package uz.shakhboz.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.shakhboz.todo.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
